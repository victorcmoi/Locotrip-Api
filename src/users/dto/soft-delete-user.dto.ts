import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SoftDeleteUserDto {
  @ApiProperty({
    description: 'Raison de la désactivation du compte',
    example: 'Demande RGPD de l\'utilisateur',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
