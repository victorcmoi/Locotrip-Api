import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationStatus } from '../enums/guide-document.enum';

export class UpdateGuideDocumentDto {
  @ApiProperty({
    enum: VerificationStatus,
    description: 'Statut de vérification du document',
    required: false,
    example: 'verified',
  })
  @IsOptional()
  @IsEnum(VerificationStatus)
  verification_status?: VerificationStatus;

  @ApiProperty({
    description: 'Commentaire de vérification',
    required: false,
    example: 'Document validé par un administrateur',
  })
  @IsOptional()
  @IsString()
  verification_comment?: string | null;

  @ApiProperty({
    description: 'URL du document sur MinIO',
    required: false,
  })
  @IsOptional()
  @IsString()
  document_url?: string;
}
