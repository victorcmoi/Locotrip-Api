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
        method: createPaymentDto.method,
        status: createPaymentDto.status,
        stripe_id: createPaymentDto.stripe_id,
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
