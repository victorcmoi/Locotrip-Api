import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGuideBoostDto } from './dto/create-guide-boost.dto';

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
      const data: any = { ...updateData };
      
      // Transformer les IDs en relations si présents
      if (updateData.guide_id) {
        data.guide = { connect: { id: updateData.guide_id } };
        delete data.guide_id;
      }
      
      if (updateData.boost_offer_id) {
        data.boost_offer = { connect: { id: updateData.boost_offer_id } };
        delete data.boost_offer_id;
      }
      
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
