import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindAllExperiencesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: "Note minimale de l'expérience",
    minimum: 0,
    maximum: 5,
    example: 4,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Prix minimum',
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Prix maximum',
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'ID de la ville',
  })
  @IsUUID()
  @IsOptional()
  cityId?: string;

  @ApiPropertyOptional({
    description: 'ID du guide',
  })
  @IsUUID()
  @IsOptional()
  guideId?: string;

  @ApiPropertyOptional({
    description: 'IDs des catégories (séparés par des virgules)',
    example: 'uuid1,uuid2',
  })
  @IsString()
  @IsOptional()
  categories?: string;

  @ApiPropertyOptional({
    description: 'Recherche par titre ou description',
    example: 'Tour Eiffel',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Durée minimale en heures',
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minDuration?: number;

  @ApiPropertyOptional({
    description: 'Durée maximale en heures',
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDuration?: number;

  @ApiPropertyOptional({
    description: 'Nombre maximum de participants',
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @ApiPropertyOptional({
    description: 'Inclus uniquement les expériences disponibles',
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
