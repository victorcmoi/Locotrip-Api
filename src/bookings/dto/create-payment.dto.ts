import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { PaymentStatus } from '../enums/payment.enum';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID de la réservation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  booking_id: string;

  @ApiProperty({
    description: 'Montant du paiement',
    example: 150.5,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Code de la devise',
    example: 'eur',
    default: 'eur',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Méthode de paiement',
    example: 'carte_bancaire',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  method: string;

  @ApiProperty({
    description: 'Statut du paiement',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    description: 'ID Stripe Payment Intent (optionnel)',
    example: 'pi_1ABC23def456GHI',
    required: false,
  })
  @IsOptional()
  @IsString()
  stripe_payment_intent_id?: string;

  @ApiProperty({
    description: 'ID Stripe Charge (optionnel)',
    example: 'ch_1ABC23def456GHI',
    required: false,
  })
  @IsOptional()
  @IsString()
  stripe_charge_id?: string;

  @ApiProperty({
    description: 'ID Stripe Customer (optionnel)',
    example: 'cus_ABC123def456',
    required: false,
  })
  @IsOptional()
  @IsString()
  stripe_customer_id?: string;

  @ApiProperty({
    description: 'Métadonnées additionnelles (optionnel)',
    example: { order_id: '12345', notes: 'Paiement expérience Paris' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
