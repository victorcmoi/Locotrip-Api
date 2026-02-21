import { UpdateMediaDto } from './dto/update-media.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MediaType } from './enums/media.enum';
import { MinioService } from '../minio/minio.service';
import { BucketName } from '../minio/enums/minio.enum';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
  ) {}

  /**
   * Crée un media et upload le fichier sur MinIO
   */
  async create(createMediaDto: CreateMediaDto) {
    return this.prisma.media.create({ data: createMediaDto });
  }

  /**
   * Upload un fichier vers MinIO et crée l'entrée dans la base de données
   */
  async uploadFile(
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    entityType: string,
    entityId: string,
    mediaType: MediaType,
    bucket: BucketName = BucketName.LOCOTRIP,
    description?: string,
  ) {
    try {
      // Génère un nom de fichier unique
      const uniqueFileName = this.minioService.generateUniqueFileName(file.originalname);
      
      // Stocke dans un dossier par type + ID : experiences/{experienceId}/, profiles/guides/images/{guideId}/, etc.
      const folder = `${entityType}s`;
      const fullPath = `${folder}/${entityId}/${uniqueFileName}`;

      // Upload vers MinIO
      const uploadResult = await this.minioService.uploadFile(
        bucket,
        fullPath,
        file.buffer,
        file.mimetype,
        {
          originalName: file.originalname,
          entityType,
          entityId,
        },
      );

      // Crée l'entrée dans la base de données
      // Set the FK columns based on entity_type so Prisma relations work
      const relationData: Record<string, string> = {};
      if (entityType === 'experience') {
        relationData.experience_id = entityId;
      } else if (entityType === 'guide') {
        relationData.guide_id = entityId;
      } else if (entityType === 'city') {
        relationData.city_id = entityId;
      } else if (entityType === 'review') {
        relationData.review_id = entityId;
      }

      const media = await this.prisma.media.create({
        data: {
          url: uploadResult.url,
          media_type: mediaType,
          entity_type: entityType,
          entity_id: entityId,
          description: description || file.originalname,
          ...relationData,
        },
      });

      return {
        media,
        uploadInfo: uploadResult,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de l'upload du fichier: ${error.message}`);
    }
  }

  /**
   * Upload plusieurs fichiers
   */
  async uploadMultipleFiles(
    files: { buffer: Buffer; originalname: string; mimetype: string; size: number }[],
    entityType: string,
    entityId: string,
    mediaType: MediaType,
    bucket: BucketName = BucketName.LOCOTRIP,
    descriptions?: string[],
  ) {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, entityType, entityId, mediaType, bucket, descriptions?.[index]),
    );

    return Promise.all(uploadPromises);
  }

  async findAll() {
    return this.prisma.media.findMany();
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException(`Media avec l'ID ${id} introuvable`);
    }

    return media;
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.media.findMany({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
    });
  }

  async findByType(typeMedia: MediaType) {
    return this.prisma.media.findMany({
      where: { media_type: typeMedia },
    });
  }

  async update(id: string, data: UpdateMediaDto) {
    try {
      return await this.prisma.media.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Media avec l'ID ${id} introuvable`);
    }
  }

  /**
   * Supprime un media et son fichier associé sur MinIO
   */
  async delete(id: string) {
    try {
      const media = await this.findOne(id);

      // Extrait le bucket et le chemin du fichier depuis l'URL
      const urlParts = new URL(media.url);
      const pathParts = urlParts.pathname.split('/').filter((p) => p);
      
      if (pathParts.length >= 2) {
        const bucket = pathParts[0];
        const filePath = pathParts.slice(1).join('/');

        // Supprime le fichier de MinIO
        await this.minioService.deleteFile(bucket, filePath);
      }

      // Supprime l'entrée de la base de données
      return await this.prisma.media.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Erreur lors de la suppression: ${error.message}`);
    }
  }

  /**
   * Supprime tous les medias d'une entité
   */
  async deleteByEntity(entityType: string, entityId: string) {
    const medias = await this.findByEntity(entityType, entityId);
    
    const deletePromises = medias.map((media) => this.delete(media.id));
    
    return Promise.all(deletePromises);
  }
}
