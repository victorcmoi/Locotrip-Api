import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVilleDto {
  @ApiProperty({
    description: 'Nom de la ville',
    example: 'Paris',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({
    description: 'Pays de la ville',
    example: 'France',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  pays: string;

  @ApiPropertyOptional({
    description: 'Description de la ville',
    example: 'La capitale française, connue pour sa tour Eiffel',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
