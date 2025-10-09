import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TypeDocument, VerificationStatus } from '../enums/guide-document.enum';

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
    enum: TypeDocument,
    example: TypeDocument.CV,
  })
  @IsEnum(TypeDocument)
  @IsNotEmpty()
  type_document: TypeDocument;

  @ApiPropertyOptional({
    description: 'Statut de vérification du document',
    enum: VerificationStatus,
    example: VerificationStatus.EN_ATTENTE,
    default: VerificationStatus.EN_ATTENTE,
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
  commentaire_verif?: string;
}
