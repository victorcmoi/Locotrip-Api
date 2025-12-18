import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    return this.prisma.subscription.create({
      data: {
        subscription_type: createSubscriptionDto.subscription_type,
        start_date: createSubscriptionDto.start_date,
        end_date: createSubscriptionDto.end_date,
        status: createSubscriptionDto.status,
        user: {
          connect: { id: createSubscriptionDto.user_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.subscription.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} introuvable`);
    }

    return subscription;
  }

  async findByUser(userId: string) {
    return this.prisma.subscription.findMany({
      where: { user_id: userId },
      orderBy: { start_date: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.subscription.findMany({
      where: {
        status: 'actif',
        end_date: { gte: new Date() },
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    try {
      const data: any = { ...updateSubscriptionDto };

      // Transformer l'ID en relation si présent
      if (updateSubscriptionDto.user_id) {
        data.user = { connect: { id: updateSubscriptionDto.user_id } };
        delete data.user_id;
      }

      return await this.prisma.subscription.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.subscription.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} introuvable`);
    }
  }
}
