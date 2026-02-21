import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Body,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { MediaType } from './enums/media.enum';
import { BucketName } from '../minio/enums/minio.enum';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '../users/enums/user.enum';
import { MinioService } from '../minio/minio.service';
import type { Response } from 'express';

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
  fieldname: string;
  encoding: string;
}

@ApiTags('Médias - Upload')
@ApiBearerAuth('JWT-auth')
@Controller('media/upload')
export class MediaUploadController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly minioService: MinioService,
  ) {}

  @Post('single')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload un seul fichier' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        entityType: { type: 'string', example: 'guide' },
        entityId: { type: 'string', example: 'uuid' },
        mediaType: { type: 'string', enum: Object.values(MediaType) },
        bucket: { type: 'string', enum: Object.values(BucketName) },
      },
    },
  })
  async uploadSingle(
    @UploadedFile() file: MulterFile,
    @Body('entityType') entityType: string,
    @Body('entityId') entityId: string,
    @Body('mediaType') mediaType: MediaType,
    @Body('bucket') bucket?: BucketName,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    return this.mediaService.uploadFile(
      file,
      entityType,
      entityId,
      mediaType,
      bucket || BucketName.LOCOTRIP,
    );
  }

  @Post('multiple')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Upload plusieurs fichiers (max 10)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        entityType: { type: 'string', example: 'guide' },
        entityId: { type: 'string', example: 'uuid' },
        mediaType: { type: 'string', enum: Object.values(MediaType) },
        bucket: { type: 'string', enum: Object.values(BucketName) },
      },
    },
  })
  async uploadMultiple(
    @UploadedFiles() files: MulterFile[],
    @Body('entityType') entityType: string,
    @Body('entityId') entityId: string,
    @Body('mediaType') mediaType: MediaType,
    @Body('bucket') bucket?: BucketName,
    @Body('descriptions') descriptionsRaw?: string | string[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // descriptions can come as a single string or an array from form-data
    const descriptions = descriptionsRaw
      ? Array.isArray(descriptionsRaw) ? descriptionsRaw : [descriptionsRaw]
      : undefined;

    return this.mediaService.uploadMultipleFiles(
      files,
      entityType,
      entityId,
      mediaType,
      bucket || BucketName.LOCOTRIP,
      descriptions,
    );
  }

  @Get('download/:bucket/*path')
  @ApiOperation({ summary: 'Télécharger un fichier depuis MinIO' })
  async downloadFile(
    @Param('bucket') bucket: string,
    @Param('path') path: string,
    @Res() res: Response,
  ) {
    try {
      const stream = await this.minioService.getFileStream(bucket, path);
      const metadata = await this.minioService.getFileMetadata(bucket, path);

      res.set({
        'Content-Type': metadata.contentType,
        'Content-Disposition': `attachment; filename="${metadata.fileName.split('/').pop()}"`,
      });

      stream.pipe(res);
    } catch (error) {
      throw new BadRequestException(`Erreur lors du téléchargement: ${error.message}`);
    }
  }

  @Get('presigned/:bucket/*path')
  @ApiOperation({ summary: 'Obtenir une URL pré-signée pour un accès temporaire' })
  async getPresignedUrl(@Param('bucket') bucket: string, @Param('path') path: string) {
    try {
      const url = await this.minioService.getPresignedUrl(bucket, path, 3600); // 1 heure
      return { url, expiresIn: 3600 };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la génération de l'URL: ${error.message}`);
    }
  }
}
