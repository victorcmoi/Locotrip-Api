import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  async create(createExperienceDto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        title: createExperienceDto.title,
        description: createExperienceDto.description,
        price: createExperienceDto.price,
        duration: createExperienceDto.duration,
        max_capacity: createExperienceDto.max_capacity,
        city: {
          connect: { id: createExperienceDto.city_id },
        },
        guide: {
          connect: { id: createExperienceDto.guide_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.experience.findMany({
      include: {
        city: true,
        guide: {
          include: {
            user: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        reviews: true,
      },
    });
  }

  async findOne(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
      include: {
        city: true,
        guide: {
          include: {
            user: true,
          },
        },
        bookings: true,
        reviews: true,
        categories: {
          include: {
            category: true,
          },
        },
        currency_prices: {
          include: {
            currency: true,
          },
        },
      },
    });

    if (!experience) {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }

    return experience;
  }

  async findByVille(villeId: string) {
    return this.prisma.experience.findMany({
      where: { city_id: villeId },
      include: {
        guide: {
          include: {
            user: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findByGuide(guideId: string) {
    return this.prisma.experience.findMany({
      where: { guide_id: guideId },
      include: {
        city: true,
        reviews: true,
      },
    });
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    try {
      const data: any = { ...updateExperienceDto };
      
      if (updateExperienceDto.city_id) {
        data.city = { connect: { id: updateExperienceDto.city_id } };
        delete data.city_id;
      }
      
      if (updateExperienceDto.guide_id) {
        data.guide = { connect: { id: updateExperienceDto.guide_id } };
        delete data.guide_id;
      }
      
      return await this.prisma.experience.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.experience.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }
  }
}
