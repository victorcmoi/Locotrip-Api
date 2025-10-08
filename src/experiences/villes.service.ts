import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VillesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.villeCreateInput) {
    return this.prisma.ville.create({ data });
  }

  async findAll() {
    return this.prisma.ville.findMany({
      include: {
        experiences: true,
      },
    });
  }

  async findOne(id: string) {
    const ville = await this.prisma.ville.findUnique({
      where: { id },
      include: {
        experiences: true,
      },
    });

    if (!ville) {
      throw new NotFoundException(`Ville avec l'ID ${id} introuvable`);
    }

    return ville;
  }

  async update(id: string, data: Prisma.villeUpdateInput) {
    try {
      return await this.prisma.ville.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Ville avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.ville.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Ville avec l'ID ${id} introuvable`);
    }
  }
}
