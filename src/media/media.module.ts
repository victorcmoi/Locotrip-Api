import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaUploadController } from './media-upload.controller';
import { MediaService } from './media.service';
import { PrismaService } from '../prisma.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [MediaController, MediaUploadController],
  providers: [MediaService, PrismaService],
  exports: [MediaService],
})
export class MediaModule {}
