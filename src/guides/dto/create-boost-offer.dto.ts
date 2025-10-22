import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsDecimal, Min, IsOptional } from 'class-validator';

export class CreateBoostOfferDto {
  @ApiProperty({
    description: 'Nom de l\'offre de boost',
    example: 'Boost Premium 30 jours',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Description de l\'offre',
    example: 'Augmentez votre visibilité pendant 30 jours',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Durée en jours',
    example: 30,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  duration_days: number;

  @ApiProperty({
    description: 'Pourcentage de réduction accordé',
    example: 20,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  discount_percentage: number;

  @ApiProperty({
    description: 'Prix de l\'offre',
    example: 49.99,
  })
  @IsDecimal()
  @IsNotEmpty()
  price: number;
}
