import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDecimal, Length } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'Code de la currency (ISO 4217)',
    example: 'EUR',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3)
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Nom de la currency',
    example: 'Euro',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Taux de change par rapport à la currency de référence',
    example: 1.0,
  })
  @IsDecimal()
  @IsNotEmpty()
  exchange_rate: number;
}
