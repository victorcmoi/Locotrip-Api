import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.currencyCreateInput) {
    return this.prisma.currency.create({ data });
  }

  async findAll() {
    return this.prisma.currency.findMany();
  }

  async findOne(code: string) {
    const currency = await this.prisma.currency.findUnique({
      where: { code },
    });

    if (!currency) {
      throw new NotFoundException(`Devise avec le code ${code} introuvable`);
    }

    return currency;
  }

  async update(code: string, data: Prisma.currencyUpdateInput) {
    try {
      return await this.prisma.currency.update({
        where: { code },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Devise avec le code ${code} introuvable`);
    }
  }

  async delete(code: string) {
    try {
      return await this.prisma.currency.delete({
        where: { code },
      });
    } catch (error) {
      throw new NotFoundException(`Devise avec le code ${code} introuvable`);
    }
  }
}
