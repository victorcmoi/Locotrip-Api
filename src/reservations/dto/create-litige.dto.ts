import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { StatutLitige } from '../../../prisma/enums';

export class CreateLitigeDto {
  @ApiProperty({
    description: 'ID de la réservation concernée',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  reservation_id: string;

  @ApiProperty({
    description: 'ID de l\'utilisateur créant le litige',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsString()
  utilisateur_id: string;

  @ApiProperty({
    description: 'Motif du litige',
    example: 'Le guide n\'est pas venu au rendez-vous',
  })
  @IsNotEmpty()
  @IsString()
  motif: string;

  @ApiProperty({
    description: 'Statut du litige',
    enum: StatutLitige,
    example: StatutLitige.OUVERT,
  })
  @IsNotEmpty()
  @IsEnum(StatutLitige)
  statut: StatutLitige;

  @ApiProperty({
    description: 'ID de l\'admin traitant le litige (optionnel)',
    example: '550e8400-e29b-41d4-a716-446655440002',
    required: false,
  })
  @IsOptional()
  @IsString()
  admin_id?: string;
}
