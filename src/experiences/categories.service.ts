import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.categoryCreateInput) {
    return this.prisma.category.create({ data });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        experiences: {
          include: {
            experience: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        experiences: {
          include: {
            experience: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} introuvable`);
    }

    return category;
  }

  async update(id: string, data: Prisma.categoryUpdateInput) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Catégorie avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Catégorie avec l'ID ${id} introuvable`);
    }
  }
}
