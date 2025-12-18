import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGuideBoostDto } from './dto/create-guide-boost.dto';
import { guide_boostUncheckedUpdateInput } from '../generated/prisma/models/guide_boost';

@Injectable()
export class GuideBoostsService {
  constructor(private prisma: PrismaService) {}

  async create(createBoostDto: CreateGuideBoostDto) {
    return this.prisma.guide_boost.create({
      data: {
        expiration_date: createBoostDto.expiration_date,
        status: createBoostDto.status,
        guide: {
          connect: { id: createBoostDto.guide_id },
        },
        boost_offer: {
          connect: { id: createBoostDto.boost_offer_id },
        },
      },
    });
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
        status: 'active',
        expiration_date: { gte: new Date() },
      },
      include: {
        guide: true,
        boost_offer: true,
      },
    });
  }

  async update(id: string, updateData: Partial<CreateGuideBoostDto>) {
    try {
      const data: guide_boostUncheckedUpdateInput = { ...updateData };

      return await this.prisma.guide_boost.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Boost avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.guide_boost.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Boost avec l'ID ${id} introuvable`);
    }
  }
}
