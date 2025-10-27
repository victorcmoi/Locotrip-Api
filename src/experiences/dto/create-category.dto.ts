import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nom de la catégorie',
    example: 'Culture',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
