import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    const apiKey = process.env.STRIPE_PRIVATE_KEY;
    
    if (!apiKey) {
      throw new Error('STRIPE_PRIVATE_KEY must be defined in environment variables');
    }

    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-09-30.clover',
    });
  }

  /**
   * Crée un Payment Intent pour un paiement
   * @param amount Montant en centimes (ex: 1000 = 10.00 EUR)
   * @param currency Code de la devise (ex: 'eur', 'usd')
   * @param description Description optionnelle du paiement
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    description?: string,
  ) {
    try {
      return await this.stripe.paymentIntents.create({
        amount,
        currency: currency.toLowerCase(),
        description,
        automatic_payment_methods: { enabled: true },
      });
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de la création du paiement: ${error.message}`,
      );
    }
  }

  /**
   * Confirme un Payment Intent
   * @param paymentIntentId ID du Payment Intent à confirmer
   */
  async confirmPayment(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.confirm(paymentIntentId);
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de la confirmation du paiement: ${error.message}`,
      );
    }
  }

  /**
   * Récupère les détails d'un Payment Intent
   * @param paymentIntentId ID du Payment Intent
   */
  async retrievePayment(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de la récupération du paiement: ${error.message}`,
      );
    }
  }

  /**
   * Annule un Payment Intent
   * @param paymentIntentId ID du Payment Intent à annuler
   */
  async cancelPayment(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de l'annulation du paiement: ${error.message}`,
      );
    }
  }
}
