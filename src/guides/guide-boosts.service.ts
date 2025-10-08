import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GuideBoostsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.guide_boostCreateInput) {
    return this.prisma.guide_boost.create({ data });
  }

  async findAll() {
    return this.prisma.guide_boost.findMany({
      include: {
        guide: true,
        boost_offer: true,
      },
    });
  }

  async findOne(id: string) {
    const boost = await this.prisma.guide_boost.findUnique({
      where: { id },
      include: {
        guide: true,
        boost_offer: true,
      },
    });

    if (!boost) {
      throw new NotFoundException(`Boost avec l'ID ${id} introuvable`);
    }

    return boost;
  }

  async findByGuide(guideId: string) {
    return this.prisma.guide_boost.findMany({
      where: { guide_id: guideId },
      include: {
        boost_offer: true,
      },
    });
  }

  async findActive() {
    return this.prisma.guide_boost.findMany({
      where: { 
        statut: 'active',
        date_expiration: { gte: new Date() },
      },
      include: {
        guide: true,
        boost_offer: true,
      },
    });
  }

  async update(id: string, data: Prisma.guide_boostUpdateInput) {
    try {
      return await this.prisma.guide_boost.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Boost avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.guide_boost.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Boost avec l'ID ${id} introuvable`);
    }
  }
}
