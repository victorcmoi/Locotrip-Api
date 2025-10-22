import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
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
    description: 'Montant du payment',
    example: 150.50,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Méthode de payment',
    example: 'carte_bancaire',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  method: string;

  @ApiProperty({
    description: 'Statut du payment',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    description: 'ID Stripe du payment (optionnel)',
    example: 'pi_1ABC23def456GHI',
    required: false,
  })
  @IsOptional()
  @IsString()
  stripe_id?: string;
}
