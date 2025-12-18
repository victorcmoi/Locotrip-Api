import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGuideAvailabilityDto } from './dto/create-guide-availability.dto';
import { guide_availabilityUncheckedUpdateInput } from '../generated/prisma/models/guide_availability';

@Injectable()
export class GuideAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async create(createAvailabilityDto: CreateGuideAvailabilityDto) {
    return this.prisma.guide_availability.create({
      data: {
        start_date: createAvailabilityDto.start_date,
        end_date: createAvailabilityDto.end_date,
        status: createAvailabilityDto.status,
        guide: {
          connect: { id: createAvailabilityDto.guide_id },
        },
      },
    });
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
      orderBy: { start_date: 'asc' },
    });
  }

  async update(id: string, updateData: Partial<CreateGuideAvailabilityDto>) {
    try {
      const data: guide_availabilityUncheckedUpdateInput = { ...updateData };

      return await this.prisma.guide_availability.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Disponibilité avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.guide_availability.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Disponibilité avec l'ID ${id} introuvable`);
    }
  }
}
