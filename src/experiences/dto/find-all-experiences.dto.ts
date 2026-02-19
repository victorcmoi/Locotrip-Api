import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindAllExperiencesDto extends PaginationDto {
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
    description: 'Inclus uniquement les expériences publiées',
    example: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  is_published?: boolean;
}
