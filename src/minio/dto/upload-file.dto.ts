import { IsString, IsOptional, IsEnum } from 'class-validator';
import { BucketName } from '../enums/minio.enum';

export class UploadFileDto {
  @IsString()
  fileName: string;

  @IsEnum(BucketName)
  bucket: BucketName;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  metadata?: Record<string, string>;
}
