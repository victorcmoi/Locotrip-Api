import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateCityDto {
  @ApiProperty({
    description: 'Nom de la ville',
    example: 'Paris',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Pays de la ville',
    example: 'France',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Slug de la ville',
    example: 'paris-france',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({
    description: 'Description de la ville',
    example: 'La capitale française, connue pour sa tour Eiffel',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Latitude du centre-ville',
    example: 48.8566,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude du centre-ville',
    example: 2.3522,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Ville active ou non',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Ville suggérée sur la page d\'accueil',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_suggested?: boolean;
}
