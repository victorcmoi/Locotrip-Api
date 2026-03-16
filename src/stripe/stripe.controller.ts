import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import {
  PaymentIntentResponseDto,
  PaymentConfirmationResponseDto,
  PaymentDetailsResponseDto,
} from './dto/payment-intent-response.dto';
import { ApiAuthResponses } from '../common/decorators/api-standard-responses.decorator';

@ApiTags('Stripe')
@ApiBearerAuth('JWT-auth')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Créer un Payment Intent Stripe',
    description:
      'Crée un nouveau Payment Intent pour initier un paiement. Le montant doit être en centimes (ex: 1000 = 10.00 EUR)',
  })
  @ApiBody({ type: CreatePaymentIntentDto })
  @ApiOkResponse({
    description: 'Payment Intent créé avec succès',
    type: PaymentIntentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Erreur lors de la création du paiement - Données invalides',
  })
  @ApiAuthResponses()
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      createPaymentIntentDto.amount,
      createPaymentIntentDto.currency,
      createPaymentIntentDto.description,
    );

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  @Post('confirm-payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirmer un paiement',
    description: 'Confirme un Payment Intent existant',
  })
  @ApiBody({ type: ConfirmPaymentDto })
  @ApiOkResponse({
    description: 'Paiement confirmé avec succès',
    type: PaymentConfirmationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Erreur lors de la confirmation du paiement',
  })
  @ApiAuthResponses()
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    const paymentIntent = await this.stripeService.confirmPayment(
      confirmPaymentDto.paymentIntentId,
    );

    return {
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
    };
  }

  @Post('retrieve-payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Récupérer un paiement',
    description: "Récupère les détails d'un Payment Intent par son ID",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentIntentId: {
          type: 'string',
          description: 'ID du Payment Intent Stripe',
          example: 'pi_1ABC23def456GHI',
        },
      },
      required: ['paymentIntentId'],
    },
  })
  @ApiOkResponse({
    description: 'Détails du paiement récupérés avec succès',
    type: PaymentDetailsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Erreur lors de la récupération du paiement',
  })
  @ApiAuthResponses()
  async retrievePayment(@Body('paymentIntentId') paymentIntentId: string) {
    const paymentIntent =
      await this.stripeService.retrievePayment(paymentIntentId);

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      description: paymentIntent.description,
    };
  }
}
