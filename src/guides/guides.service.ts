import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GuidesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.guideCreateInput) {
    return this.prisma.guide.create({ data });
  }

  async findAll() {
    return this.prisma.guide.findMany({
      include: {
        utilisateur: true,
        documents: true,
        disponibilites: true,
        boosts: true,
        experiences: true,
      },
    });
  }

  async findOne(id: string) {
    const guide = await this.prisma.guide.findUnique({
      where: { id },
      include: {
        utilisateur: true,
        documents: true,
        disponibilites: true,
        boosts: {
          include: {
            boost_offer: true,
          },
        },
        experiences: true,
      },
    });

    if (!guide) {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }

    return guide;
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.guide.findMany({
      where: { utilisateur_id: utilisateurId },
      include: {
        documents: true,
        disponibilites: true,
        experiences: true,
      },
    });
  }

  async update(id: string, data: Prisma.guideUpdateInput) {
    try {
      return await this.prisma.guide.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.guide.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }
  }
}
