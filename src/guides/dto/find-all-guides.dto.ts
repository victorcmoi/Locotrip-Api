import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsString, IsDate } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindAllGuidesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Note minimale du guide',
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
    description: "Nombre minimum d'avis",
    minimum: 0,
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minReviews?: number;

  @ApiPropertyOptional({
    description: 'Code pays (ISO)',
    example: 'FR',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Langues parlées (séparées par des virgules)',
    example: 'fr,en',
  })
  @IsString()
  @IsOptional()
  languages?: string;

  @ApiPropertyOptional({
    description: 'Recherche par nom ou bio',
    example: 'Paris',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: "Années d'expérience minimales",
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minExperience?: number;

  @ApiPropertyOptional({
    description: 'Date de début pour rechercher les guides ayant des expériences dans cette plage (format ISO 8601)',
    example: '2026-01-11T00:00:00Z',
  })
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Date de fin pour rechercher les guides ayant des expériences dans cette plage (format ISO 8601)',
    example: '2026-01-11T23:59:59Z',
  })
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;
}
