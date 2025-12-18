import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { DocumentType, VerificationStatus } from '../enums/guide-document.enum';

export class CreateGuideDocumentDto {
  @ApiProperty({
    description: 'ID du guide',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  guide_id: string;

  @ApiProperty({
    description: 'Type de document',
    enum: DocumentType,
    example: DocumentType.CV,
  })
  @IsEnum(DocumentType)
  @IsNotEmpty()
  document_type: DocumentType;

  @ApiPropertyOptional({
    description: 'Statut de vérification du document',
    enum: VerificationStatus,
    example: VerificationStatus.PENDING,
    default: VerificationStatus.PENDING,
  })
  @IsEnum(VerificationStatus)
  @IsOptional()
  verification_status?: VerificationStatus;

  @ApiPropertyOptional({
    description: 'Commentaire de vérification',
    example: 'Document clair et conforme',
  })
  @IsString()
  @IsOptional()
  verification_comment?: string;
}
