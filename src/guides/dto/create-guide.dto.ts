import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, IsNotEmpty, IsUUID, IsEnum, Min } from 'class-validator';
import { StatutGuide } from '../../../prisma/enums';

export class CreateGuideDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur associé au guide',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  utilisateur_id: string;

  @ApiPropertyOptional({
    description: 'Biographie du guide',
    example: 'Guide passionné avec 10 ans d\'expérience à Paris',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Langues parlées par le guide (séparées par des virgules)',
    example: 'Français, Anglais, Espagnol',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  langues?: string;

  @ApiPropertyOptional({
    description: 'Années d\'expérience en tant que guide',
    example: 5,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  experience_annees?: number;

  @ApiProperty({
    description: 'Statut du guide',
    enum: StatutGuide,
    example: StatutGuide.LOCAL,
  })
  @IsEnum(StatutGuide)
  @IsNotEmpty()
  statut_guide: StatutGuide;

  @ApiPropertyOptional({
    description: 'Indique si le guide possède une carte professionnelle',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  carte_pro?: boolean;

  @ApiPropertyOptional({
    description: 'Pays du guide',
    example: 'France',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  pays?: string;

  @ApiPropertyOptional({
    description: 'Commentaire interne (visible uniquement par les admins)',
    example: 'Documents vérifiés',
  })
  @IsString()
  @IsOptional()
  commentaire_interne?: string;
}
