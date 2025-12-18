import { ApiProperty } from '@nestjs/swagger';

export class PaymentIntentResponseDto {
  @ApiProperty({
    description: 'Client secret pour compléter le paiement côté client',
    example: 'pi_3OBvUn2eZvKYlo2C0x7xhqzU_secret_ABC123',
  })
  clientSecret: string;

  @ApiProperty({
    description: 'ID du Payment Intent Stripe',
    example: 'pi_3OBvUn2eZvKYlo2C0x7xhqzU',
  })
  paymentIntentId: string;
}

export class PaymentConfirmationResponseDto {
  @ApiProperty({
    description: 'Statut du paiement',
    example: 'succeeded',
    enum: [
      'requires_payment_method',
      'requires_confirmation',
      'requires_action',
      'processing',
      'succeeded',
      'canceled',
    ],
  })
  status: string;

  @ApiProperty({
    description: 'ID du Payment Intent Stripe',
    example: 'pi_3OBvUn2eZvKYlo2C0x7xhqzU',
  })
  paymentIntentId: string;
}

export class PaymentDetailsResponseDto {
  @ApiProperty({
    description: 'ID du Payment Intent Stripe',
    example: 'pi_3OBvUn2eZvKYlo2C0x7xhqzU',
  })
  id: string;

  @ApiProperty({
    description: 'Montant du paiement en centimes',
    example: 5000,
  })
  amount: number;

  @ApiProperty({
    description: 'Code de la devise',
    example: 'eur',
  })
  currency: string;

  @ApiProperty({
    description: 'Statut du paiement',
    example: 'succeeded',
  })
  status: string;

  @ApiProperty({
    description: 'Description du paiement',
    example: 'Réservation expérience Paris - Visite du Louvre',
    required: false,
  })
  description?: string;
}
