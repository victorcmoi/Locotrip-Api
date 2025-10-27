import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, IsNotEmpty, IsUUID, IsEnum, Min } from 'class-validator';
import { GuideStatus } from '../enums/guide.enum';

export class CreateGuideDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur associé au guide',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

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
  languages?: string;

  @ApiPropertyOptional({
    description: 'Années d\'expérience en tant que guide',
    example: 5,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  years_of_experience?: number;

  @ApiProperty({
    description: 'Statut du guide',
    enum: GuideStatus,
    example: GuideStatus.LOCAL,
  })
  @IsEnum(GuideStatus)
  @IsNotEmpty()
  guide_status: GuideStatus;

  @ApiPropertyOptional({
    description: 'Indique si le guide possède une carte professionnelle',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  pro_card?: boolean;

  @ApiPropertyOptional({
    description: 'Pays du guide',
    example: 'France',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Commentaire interne (visible uniquement par les admins)',
    example: 'Documents vérifiés',
  })
  @IsString()
  @IsOptional()
  internal_comment?: string;
}
