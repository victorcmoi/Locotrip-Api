import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperienceCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.experience_categorieCreateInput) {
    return this.prisma.experience_categorie.create({ data });
  }

  async findAll() {
    return this.prisma.experience_categorie.findMany({
      include: {
        experience: true,
        categorie: true,
      },
    });
  }

  async findByExperience(experienceId: string) {
    return this.prisma.experience_categorie.findMany({
      where: { experience_id: experienceId },
      include: {
        categorie: true,
      },
    });
  }

  async delete(experienceId: string, categorieId: string) {
    return this.prisma.experience_categorie.delete({
      where: {
        experience_id_categorie_id: {
          experience_id: experienceId,
          categorie_id: categorieId,
        },
      },
    });
  }
}
