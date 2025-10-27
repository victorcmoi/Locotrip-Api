import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({
    description: 'Nom de la ville',
    example: 'Paris',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Pays de la ville',
    example: 'France',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({
    description: 'Description de la ville',
    example: 'La capitale française, connue pour sa tour Eiffel',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
