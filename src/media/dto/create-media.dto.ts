import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { TypeMedia } from '../../../prisma/enums';

export class CreateMediaDto {
  @ApiProperty({
    description: 'Type d\'entité (experience, guide, utilisateur, reservation)',
    example: 'experience',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  entity_type: string;

  @ApiProperty({
    description: 'ID de l\'entité associée',
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
    enum: TypeMedia,
    example: TypeMedia.PHOTO,
  })
  @IsEnum(TypeMedia)
  @IsNotEmpty()
  type_media: TypeMedia;

  @ApiPropertyOptional({
    description: 'Description du média',
    example: 'Vue panoramique de la Tour Eiffel',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
