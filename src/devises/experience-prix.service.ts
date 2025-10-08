import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperiencePrixService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.experience_prixCreateInput) {
    return this.prisma.experience_prix.create({ data });
  }

  async findAll() {
    return this.prisma.experience_prix.findMany({
      include: {
        experience: true,
        devise: true,
      },
    });
  }

  async findByExperience(experienceId: string) {
    return this.prisma.experience_prix.findMany({
      where: { experience_id: experienceId },
      include: {
        devise: true,
      },
    });
  }

  async findByDevise(deviseCode: string) {
    return this.prisma.experience_prix.findMany({
      where: { devise_code: deviseCode },
      include: {
        experience: true,
      },
    });
  }

  async update(experienceId: string, deviseCode: string, data: Prisma.experience_prixUpdateInput) {
    return this.prisma.experience_prix.update({
      where: {
        experience_id_devise_code: {
          experience_id: experienceId,
          devise_code: deviseCode,
        },
      },
      data,
    });
  }

  async delete(experienceId: string, deviseCode: string) {
    return this.prisma.experience_prix.delete({
      where: {
        experience_id_devise_code: {
          experience_id: experienceId,
          devise_code: deviseCode,
        },
      },
    });
  }
}
