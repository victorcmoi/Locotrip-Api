import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsUUID,
  IsOptional,
  Min,
  IsDecimal,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({
    description: "Titre de l'expérience",
    example: 'Visite guidée du Louvre',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: "Description détaillée de l'expérience",
    example: "Découvrez les chefs-d'œuvre du Louvre avec un guide expert",
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Prix de l'expérience (en euros)",
    example: 45.0,
  })
  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: "Durée de l'expérience en minutes",
    example: 120,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    description: "ID de la ville où se déroule l'expérience",
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  city_id: string;

  @ApiProperty({
    description: "ID du guide qui propose l'expérience",
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsNotEmpty()
  guide_id: string;

  @ApiPropertyOptional({
    description: 'Capacité maximale de participants',
    example: 15,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  max_capacity?: number;
}
