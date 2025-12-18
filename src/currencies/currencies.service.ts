import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    return this.prisma.currency.create({ data: createCurrencyDto });
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

  async update(code: string, updateCurrencyDto: UpdateCurrencyDto) {
    try {
      return await this.prisma.currency.update({
        where: { code },
        data: updateCurrencyDto,
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
