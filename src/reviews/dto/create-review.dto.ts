import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui donne l'avis",
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: "ID de l'expérience évaluée",
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsNotEmpty()
  experience_id: string;

  @ApiProperty({
    description: 'Note de 1 à 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiPropertyOptional({
    description: "Titre de l'avis",
    example: 'Expérience incroyable !',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: "Commentaire de l'utilisateur",
    example: 'Excellente expérience, guide très professionnel !',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
