import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency || 'eur',
        method: createPaymentDto.method,
        status: createPaymentDto.status,
        stripe_payment_intent_id: createPaymentDto.stripe_payment_intent_id,
        stripe_charge_id: createPaymentDto.stripe_charge_id,
        stripe_customer_id: createPaymentDto.stripe_customer_id,
        metadata: createPaymentDto.metadata,
        booking: {
          connect: { id: createPaymentDto.booking_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        booking: {
          include: {
            user: true,
            experience: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            user: true,
            experience: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Paiement avec l'ID ${id} introuvable`);
    }

    return payment;
  }

  async findByBooking(bookingId: string) {
    return this.prisma.payment.findMany({
      where: { booking_id: bookingId },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findByStripePaymentIntent(stripePaymentIntentId: string) {
    return this.prisma.payment.findUnique({
      where: { stripe_payment_intent_id: stripePaymentIntentId },
      include: {
        booking: true,
      },
    });
  }

  async findByStripeCustomer(stripeCustomerId: string) {
    return this.prisma.payment.findMany({
      where: { stripe_customer_id: stripeCustomerId },
      include: {
        booking: {
          include: {
            experience: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      const data: any = { ...updatePaymentDto };

      // Transformer l'ID en relation si présent
      if (updatePaymentDto.booking_id) {
        data.booking = { connect: { id: updatePaymentDto.booking_id } };
        delete data.booking_id;
      }

      return await this.prisma.payment.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Paiement avec l'ID ${id} introuvable`);
    }
  }

  async updateByStripePaymentIntent(
    stripePaymentIntentId: string,
    updatePaymentDto: UpdatePaymentDto,
  ) {
    try {
      return await this.prisma.payment.update({
        where: { stripe_payment_intent_id: stripePaymentIntentId },
        data: updatePaymentDto,
      });
    } catch (error) {
      throw new NotFoundException(
        `Paiement avec Stripe Payment Intent ${stripePaymentIntentId} introuvable`,
      );
    }
  }

  async markAsCompleted(id: string, stripeChargeId?: string) {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: 'completed',
        stripe_charge_id: stripeChargeId,
        payment_date: new Date(),
      },
    });
  }

  async markAsFailed(id: string, failureReason: string) {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: 'failed',
        failure_reason: failureReason,
      },
    });
  }

  async markAsRefunded(id: string, refundedAmount: number) {
    const payment = await this.findOne(id);
    const isPartialRefund = refundedAmount < Number(payment.amount);

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: isPartialRefund ? 'partially_refunded' : 'refunded',
        refunded_amount: refundedAmount,
        refunded_at: new Date(),
      },
    });
  }

  async delete(id: string) {
    try {
      return await this.prisma.payment.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Paiement avec l'ID ${id} introuvable`);
    }
  }
}
