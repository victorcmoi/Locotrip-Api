import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({
    description: 'Nom de la city',
    example: 'Paris',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Pays de la city',
    example: 'France',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({
    description: 'Description de la city',
    example: 'La capitale française, connue pour sa tour Eiffel',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
