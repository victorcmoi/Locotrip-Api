import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoostOffersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.boost_offerCreateInput) {
    return this.prisma.boost_offer.create({ data });
  }

  async findAll() {
    return this.prisma.boost_offer.findMany();
  }

  async findOne(id: string) {
    const offer = await this.prisma.boost_offer.findUnique({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException(`Offre de boost avec l'ID ${id} introuvable`);
    }

    return offer;
  }

  async update(id: string, data: Prisma.boost_offerUpdateInput) {
    try {
      return await this.prisma.boost_offer.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Offre de boost avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.boost_offer.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Offre de boost avec l'ID ${id} introuvable`);
    }
  }
}
