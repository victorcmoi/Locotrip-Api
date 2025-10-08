import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DevisesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.deviseCreateInput) {
    return this.prisma.devise.create({ data });
  }

  async findAll() {
    return this.prisma.devise.findMany();
  }

  async findOne(code: string) {
    const devise = await this.prisma.devise.findUnique({
      where: { code },
    });

    if (!devise) {
      throw new NotFoundException(`Devise avec le code ${code} introuvable`);
    }

    return devise;
  }

  async update(code: string, data: Prisma.deviseUpdateInput) {
    try {
      return await this.prisma.devise.update({
        where: { code },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Devise avec le code ${code} introuvable`);
    }
  }

  async delete(code: string) {
    try {
      return await this.prisma.devise.delete({
        where: { code },
      });
    } catch (error) {
      throw new NotFoundException(`Devise avec le code ${code} introuvable`);
    }
  }
}
