import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GuideAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.guide_availabilityCreateInput) {
    return this.prisma.guide_availability.create({ data });
  }

  async findAll() {
    return this.prisma.guide_availability.findMany({
      include: {
        guide: true,
      },
    });
  }

  async findOne(id: string) {
    const availability = await this.prisma.guide_availability.findUnique({
      where: { id },
      include: {
        guide: true,
      },
    });

    if (!availability) {
      throw new NotFoundException(`Disponibilité avec l'ID ${id} introuvable`);
    }

    return availability;
  }

  async findByGuide(guideId: string) {
    return this.prisma.guide_availability.findMany({
      where: { guide_id: guideId },
      orderBy: { date_debut: 'asc' },
    });
  }

  async update(id: string, data: Prisma.guide_availabilityUpdateInput) {
    try {
      return await this.prisma.guide_availability.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Disponibilité avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.guide_availability.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Disponibilité avec l'ID ${id} introuvable`);
    }
  }
}
