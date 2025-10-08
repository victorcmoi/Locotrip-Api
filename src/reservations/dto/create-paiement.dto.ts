import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { StatutPaiement } from '../../../prisma/enums';

export class CreatePaiementDto {
  @ApiProperty({
    description: 'ID de la réservation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  reservation_id: string;

  @ApiProperty({
    description: 'Montant du paiement',
    example: 150.50,
  })
  @IsNotEmpty()
  @IsNumber()
  montant: number;

  @ApiProperty({
    description: 'Méthode de paiement',
    example: 'carte_bancaire',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  methode: string;

  @ApiProperty({
    description: 'Statut du paiement',
    enum: StatutPaiement,
    example: StatutPaiement.EN_ATTENTE,
  })
  @IsNotEmpty()
  @IsEnum(StatutPaiement)
  statut: StatutPaiement;

  @ApiProperty({
    description: 'ID Stripe du paiement (optionnel)',
    example: 'pi_1ABC23def456GHI',
    required: false,
  })
  @IsOptional()
  @IsString()
  stripe_id?: string;
}
