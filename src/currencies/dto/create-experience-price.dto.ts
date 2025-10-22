import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateExperiencePriceDto {
  @ApiProperty({
    description: 'ID de l\'expérience',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  experience_id: string;

  @ApiProperty({
    description: 'Code de la currency (3 caractères)',
    example: 'EUR',
    maxLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  currency_code: string;

  @ApiProperty({
    description: 'Prix dans la currency spécifiée',
    example: 49.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
