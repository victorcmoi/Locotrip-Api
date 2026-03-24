import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExperienceCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(experienceId: string, categoryId: string) {
    return this.prisma.experience_category.create({
      data: {
        experience_id: experienceId,
        category_id: categoryId,
      },
    });
  }

  async update(
    experienceId: string,
    previousCategoryId: string,
    newCategoryId: string,
  ) {
    return this.prisma.experience_category.update({
      where: {
        experience_id_category_id: {
          experience_id: experienceId,
          category_id: previousCategoryId,
        },
      },
      data: {
        category_id: newCategoryId,
      },
    });
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
