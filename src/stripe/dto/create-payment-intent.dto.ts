import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'Montant du paiement en centimes (ex: 1000 = 10.00 EUR)',
    example: 5000,
    minimum: 50,
  })
  @IsNumber()
  @Min(50, { message: 'Le montant doit être supérieur à 50 centimes' })
  amount: number;

  @ApiProperty({
    description: 'Code de la devise (ISO 4217)',
    example: 'eur',
    default: 'eur',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Description du paiement (optionnel)',
    example: 'Réservation expérience Paris - Visite du Louvre',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
