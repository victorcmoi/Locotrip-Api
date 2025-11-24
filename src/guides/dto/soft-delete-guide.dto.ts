import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SoftDeleteGuideDto {
  @ApiProperty({
    description: 'Raison de la suspension du guide',
    example: 'Plaintes multiples de clients',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
