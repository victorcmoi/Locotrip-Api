import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperienceCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.experience_categoryCreateInput) {
    return this.prisma.experience_category.create({ data });
  }

  async findAll() {
    return this.prisma.experience_category.findMany({
      include: {
        experience: true,
        category: true,
      },
    });
  }

  async findByExperience(experienceId: string) {
    return this.prisma.experience_category.findMany({
      where: { experience_id: experienceId },
      include: {
        category: true,
      },
    });
  }

  async delete(experienceId: string, categorieId: string) {
    return this.prisma.experience_category.delete({
      where: {
        experience_id_category_id: {
          experience_id: experienceId,
          category_id: categorieId,
        },
      },
    });
  }
}
