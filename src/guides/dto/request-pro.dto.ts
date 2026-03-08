import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentType } from '../enums/guide-document.enum';

class ProRequestDocumentDto {
  @ApiProperty({ enum: DocumentType, description: 'Type de document' })
  @IsEnum(DocumentType)
  document_type: DocumentType;

  @ApiProperty({ description: 'URL du document uploadé sur MinIO' })
  @IsString()
  document_url: string;
}

export class RequestProDto {
  @ApiProperty({
    type: [ProRequestDocumentDto],
    description: 'Liste des documents à soumettre',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProRequestDocumentDto)
  documents?: ProRequestDocumentDto[];
}
