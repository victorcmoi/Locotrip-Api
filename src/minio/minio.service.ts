import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Readable } from 'stream';

export interface UploadResult {
  url: string;
  bucket: string;
  key: string;
  etag: string;
  size: number;
}

export interface FileMetadata {
  fileName: string;
  size: number;
  contentType: string;
  lastModified: Date;
  etag: string;
}

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private readonly endpoint: string;
  private readonly port: number;
  private readonly useSSL: boolean;
  private readonly publicUrl: string;

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    this.port = parseInt(this.configService.get<string>('MINIO_PORT', '9000'), 10);
    this.useSSL = this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    this.publicUrl = this.configService.get<string>('MINIO_PUBLIC_URL', `http://${this.endpoint}:${this.port}`);

    this.minioClient = new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey: this.configService.get<string>('MINIO_ROOT_USER'),
      secretKey: this.configService.get<string>('MINIO_ROOT_PASSWORD'),
    });
  }

  async onModuleInit() {
    this.logger.log('MinIO Service initialized');
  }

  /**
   * Crée un bucket s'il n'existe pas déjà
   */
  async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(bucketName, 'eu-west-1');
        this.logger.log(`Bucket "${bucketName}" créé avec succès`);

        // Définir la politique publique pour le bucket (optionnel)
        await this.setBucketPolicy(bucketName);
      }
    } catch (error) {
      this.logger.error(`Erreur lors de la création du bucket "${bucketName}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Définit une politique de lecture publique pour un bucket
   */
  async setBucketPolicy(bucketName: string): Promise<void> {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    try {
      await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
      this.logger.log(`Politique publique définie pour le bucket "${bucketName}"`);
    } catch (error) {
      this.logger.warn(`Impossible de définir la politique pour "${bucketName}": ${error.message}`);
    }
  }

  /**
   * Upload un fichier depuis un buffer
   */
  async uploadFile(
    bucketName: string,
    fileName: string,
    buffer: Buffer,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<UploadResult> {
    await this.ensureBucketExists(bucketName);

    try {
      const metaData = {
        'Content-Type': contentType,
        ...metadata,
      };

      const result = await this.minioClient.putObject(
        bucketName,
        fileName,
        buffer,
        buffer.length,
        metaData,
      );

      const url = `${this.publicUrl}/${bucketName}/${fileName}`;

      this.logger.log(`Fichier uploadé: ${fileName} dans ${bucketName}`);

      return {
        url,
        bucket: bucketName,
        key: fileName,
        etag: result.etag,
        size: buffer.length,
      };
    } catch (error) {
      this.logger.error(`Erreur lors de l'upload du fichier: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload un fichier depuis un stream
   */
  async uploadStream(
    bucketName: string,
    fileName: string,
    stream: Readable,
    size: number,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<UploadResult> {
    await this.ensureBucketExists(bucketName);

    try {
      const metaData = {
        'Content-Type': contentType,
        ...metadata,
      };

      const result = await this.minioClient.putObject(
        bucketName,
        fileName,
        stream,
        size,
        metaData,
      );

      const url = `${this.publicUrl}/${bucketName}/${fileName}`;

      this.logger.log(`Fichier streamé uploadé: ${fileName} dans ${bucketName}`);

      return {
        url,
        bucket: bucketName,
        key: fileName,
        etag: result.etag,
        size,
      };
    } catch (error) {
      this.logger.error(`Erreur lors de l'upload du stream: ${error.message}`);
      throw error;
    }
  }

  /**
   * Télécharge un fichier et retourne un buffer
   */
  async downloadFile(bucketName: string, fileName: string): Promise<Buffer> {
    try {
      const stream = await this.minioClient.getObject(bucketName, fileName);
      const chunks: Buffer[] = [];

      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Erreur lors du téléchargement du fichier: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtient un stream de téléchargement
   */
  async getFileStream(bucketName: string, fileName: string): Promise<Readable> {
    try {
      return await this.minioClient.getObject(bucketName, fileName);
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération du stream: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprime un fichier
   */
  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, fileName);
      this.logger.log(`Fichier supprimé: ${fileName} du bucket ${bucketName}`);
    } catch (error) {
      this.logger.error(`Erreur lors de la suppression du fichier: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprime plusieurs fichiers
   */
  async deleteFiles(bucketName: string, fileNames: string[]): Promise<void> {
    try {
      await this.minioClient.removeObjects(bucketName, fileNames);
      this.logger.log(`${fileNames.length} fichiers supprimés du bucket ${bucketName}`);
    } catch (error) {
      this.logger.error(`Erreur lors de la suppression multiple: ${error.message}`);
      throw error;
    }
  }

  /**
   * Liste les fichiers dans un bucket avec un préfixe
   */
  async listFiles(bucketName: string, prefix: string = ''): Promise<FileMetadata[]> {
    try {
      const stream = this.minioClient.listObjects(bucketName, prefix, true);
      const files: FileMetadata[] = [];

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          if (obj.name && obj.size !== undefined && obj.lastModified && obj.etag) {
            files.push({
              fileName: obj.name,
              size: obj.size,
              contentType: 'application/octet-stream',
              lastModified: obj.lastModified,
              etag: obj.etag,
            });
          }
        });
        stream.on('end', () => resolve(files));
        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Erreur lors du listing des fichiers: ${error.message}`);
      throw error;
    }
  }

  /**
   * Vérifie si un fichier existe
   */
  async fileExists(bucketName: string, fileName: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(bucketName, fileName);
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Obtient les métadonnées d'un fichier
   */
  async getFileMetadata(bucketName: string, fileName: string): Promise<FileMetadata> {
    try {
      const stat = await this.minioClient.statObject(bucketName, fileName);
      return {
        fileName,
        size: stat.size,
        contentType: stat.metaData['content-type'] || 'application/octet-stream',
        lastModified: stat.lastModified,
        etag: stat.etag,
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des métadonnées: ${error.message}`);
      throw error;
    }
  }

  /**
   * Génère une URL pré-signée pour un accès temporaire
   */
  async getPresignedUrl(
    bucketName: string,
    fileName: string,
    expirySeconds: number = 3600,
  ): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(bucketName, fileName, expirySeconds);
    } catch (error) {
      this.logger.error(`Erreur lors de la génération de l'URL pré-signée: ${error.message}`);
      throw error;
    }
  }

  /**
   * Copie un fichier d'un bucket/clé vers un autre
   */
  async copyFile(
    sourceBucket: string,
    sourceFile: string,
    destBucket: string,
    destFile: string,
  ): Promise<void> {
    try {
      await this.ensureBucketExists(destBucket);
      const conds = new Minio.CopyConditions();
      await this.minioClient.copyObject(
        destBucket,
        destFile,
        `/${sourceBucket}/${sourceFile}`,
        conds,
      );
      this.logger.log(`Fichier copié de ${sourceBucket}/${sourceFile} vers ${destBucket}/${destFile}`);
    } catch (error) {
      this.logger.error(`Erreur lors de la copie du fichier: ${error.message}`);
      throw error;
    }
  }

  /**
   * Génère un nom de fichier unique
   */
  generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    
    return `${sanitizedName}_${timestamp}_${random}.${extension}`;
  }

  /**
   * Génère un chemin organisé par date (année/mois/jour)
   */
  generateDatePath(prefix: string = ''): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return prefix ? `${prefix}/${year}/${month}/${day}` : `${year}/${month}/${day}`;
  }

  /**
   * Supprime tous les fichiers d'un bucket
   */
  async clearBucket(bucketName: string): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        this.logger.log(`Bucket "${bucketName}" n'existe pas, rien à nettoyer`);
        return;
      }

      const files = await this.listFiles(bucketName);
      if (files.length > 0) {
        const fileNames = files.map(f => f.fileName);
        await this.deleteFiles(bucketName, fileNames);
        this.logger.log(`Bucket "${bucketName}" nettoyé (${files.length} fichiers supprimés)`);
      } else {
        this.logger.log(`Bucket "${bucketName}" est déjà vide`);
      }
    } catch (error) {
      this.logger.error(`Erreur lors du nettoyage du bucket "${bucketName}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprime un bucket et tout son contenu
   */
  async deleteBucket(bucketName: string): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        this.logger.log(`Bucket "${bucketName}" n'existe pas`);
        return;
      }

      // D'abord supprimer tous les fichiers
      await this.clearBucket(bucketName);

      // Puis supprimer le bucket
      await this.minioClient.removeBucket(bucketName);
      this.logger.log(`Bucket "${bucketName}" supprimé avec succès`);
    } catch (error) {
      this.logger.error(`Erreur lors de la suppression du bucket "${bucketName}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Liste tous les buckets
   */
  async listBuckets(): Promise<string[]> {
    try {
      const buckets = await this.minioClient.listBuckets();
      return buckets.map(b => b.name);
    } catch (error) {
      this.logger.error(`Erreur lors du listing des buckets: ${error.message}`);
      throw error;
    }
  }
}
