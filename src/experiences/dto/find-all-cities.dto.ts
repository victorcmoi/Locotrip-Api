import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindAllCitiesDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Code pays (ISO)',
    example: 'FR',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Recherche par nom de ville (commence par)',
    example: 'Paris',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
