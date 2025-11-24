import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'ID du Payment Intent Stripe à confirmer',
    example: 'pi_3OBvUn2eZvKYlo2C0x7xhqzU',
  })
  @IsString()
  paymentIntentId: string;
}
