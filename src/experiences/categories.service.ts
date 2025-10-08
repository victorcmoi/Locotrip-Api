import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.categorieCreateInput) {
    return this.prisma.categorie.create({ data });
  }

  async findAll() {
    return this.prisma.categorie.findMany({
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
    const categorie = await this.prisma.categorie.findUnique({
      where: { id },
      include: {
        experiences: {
          include: {
            experience: true,
          },
        },
      },
    });

    if (!categorie) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} introuvable`);
    }

    return categorie;
  }

  async update(id: string, data: Prisma.categorieUpdateInput) {
    try {
      return await this.prisma.categorie.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.categorie.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} introuvable`);
    }
  }
}
