import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { DisputeStatus } from '../enums/dispute.enum';

export class CreateDisputeDto {
  @ApiProperty({
    description: 'ID de la réservation concernée',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  booking_id: string;

  @ApiProperty({
    description: "ID de l'utilisateur créant le litige",
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({
    description: 'Motif du litige',
    example: "Le guide n'est pas venu au rendez-vous",
  })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'Statut du litige',
    enum: DisputeStatus,
    example: DisputeStatus.OUVERT,
  })
  @IsNotEmpty()
  @IsEnum(DisputeStatus)
  status: DisputeStatus;

  @ApiProperty({
    description: "ID de l'admin traitant le litige (optionnel)",
    example: '550e8400-e29b-41d4-a716-446655440002',
    required: false,
  })
  @IsOptional()
  @IsString()
  admin_id?: string;
}
