import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsOptional,
    IsNumber,
    Min,
    IsString,
    IsEnum,
    IsDate,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export enum SearchMode {
    GUIDE = 'guide',
    EXPERIENCE = 'experience',
}

export class SearchDto extends PaginationDto {
    @ApiProperty({
        description: 'Mode de recherche : guide ou experience',
        enum: SearchMode,
        example: SearchMode.GUIDE,
    })
    @IsEnum(SearchMode)
    mode: SearchMode;

    @ApiPropertyOptional({
        description: 'Localisation (nom de ville)',
        example: 'Paris',
    })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiPropertyOptional({
        description: 'Pays (pour les expériences)',
        example: 'France',
    })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiPropertyOptional({
        description: 'Date de début de disponibilité (format ISO 8601)',
        example: '2026-02-18T23:00:00.000Z',
    })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    startDate?: Date;

    @ApiPropertyOptional({
        description: 'Date de fin de disponibilité (format ISO 8601)',
        example: '2026-02-20T23:00:00.000Z',
    })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    endDate?: Date;

    @ApiPropertyOptional({
        description: 'Note minimale',
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
        description: 'Recherche textuelle',
        example: 'tour eiffel',
    })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({
        description: 'Prix minimum (pour les expériences)',
        minimum: 0,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    minPrice?: number;

    @ApiPropertyOptional({
        description: 'Prix maximum (pour les expériences)',
        minimum: 0,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    maxPrice?: number;

    @ApiPropertyOptional({
        description: 'Langues parlées (séparées par des virgules, pour les guides)',
        example: 'fr,en',
    })
    @IsString()
    @IsOptional()
    languages?: string;

    @ApiPropertyOptional({
        description: "Années d'expérience minimales (pour les guides)",
        minimum: 0,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    minExperience?: number;

    @ApiPropertyOptional({
        description: 'IDs des catégories (séparés par des virgules, pour les expériences)',
        example: 'uuid1,uuid2',
    })
    @IsString()
    @IsOptional()
    categories?: string;

    @ApiPropertyOptional({
        description: 'Durée minimale en heures (pour les expériences)',
        minimum: 0,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    minDuration?: number;

    @ApiPropertyOptional({
        description: 'Durée maximale en heures (pour les expériences)',
        minimum: 0,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    maxDuration?: number;

    @ApiPropertyOptional({
        description: 'Nombre maximum de participants (pour les expériences)',
        minimum: 1,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsOptional()
    maxParticipants?: number;
}
