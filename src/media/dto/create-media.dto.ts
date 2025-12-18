import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { MediaType } from '../enums/media.enum';

export class CreateMediaDto {
  @ApiProperty({
    description: "Type d'entité (experience, guide, utilisateur, réservation)",
    example: 'experience',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  entity_type: string;

  @ApiProperty({
    description: "ID de l'entité associée",
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  entity_id: string;

  @ApiProperty({
    description: 'URL du média',
    example: 'https://example.com/images/photo.jpg',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Type de média',
    enum: MediaType,
    example: MediaType.PHOTO,
  })
  @IsEnum(MediaType)
  @IsNotEmpty()
  media_type: MediaType;

  @ApiPropertyOptional({
    description: 'Description du média',
    example: 'Vue panoramique de la Tour Eiffel',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
