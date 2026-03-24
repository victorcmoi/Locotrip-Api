import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { GuideStatus } from '../enums/guide.enum';
import { Type } from 'class-transformer';

export class FindAllGuidesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Code pays (ISO)',
    example: 'FR',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Statut du guide (LOCAL ou PROFESSIONAL)',
    enum: GuideStatus,
    example: GuideStatus.LOCAL,
  })
  @IsOptional()
  guide_status?: GuideStatus;

  @ApiPropertyOptional({
    description: 'Filtrer par statut actif/inactif',
    example: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
