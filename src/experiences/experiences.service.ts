import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.experienceCreateInput) {
    return this.prisma.experience.create({ data });
  }

  async findAll() {
    return this.prisma.experience.findMany({
      include: {
        ville: true,
        guide: {
          include: {
            utilisateur: true,
          },
        },
        categories: {
          include: {
            categorie: true,
          },
        },
        avis: true,
      },
    });
  }

  async findOne(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
      include: {
        ville: true,
        guide: {
          include: {
            utilisateur: true,
          },
        },
        reservations: true,
        avis: true,
        categories: {
          include: {
            categorie: true,
          },
        },
        prix_devises: {
          include: {
            devise: true,
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
      where: { ville_id: villeId },
      include: {
        guide: {
          include: {
            utilisateur: true,
          },
        },
        categories: {
          include: {
            categorie: true,
          },
        },
      },
    });
  }

  async findByGuide(guideId: string) {
    return this.prisma.experience.findMany({
      where: { guide_id: guideId },
      include: {
        ville: true,
        avis: true,
      },
    });
  }

  async update(id: string, data: Prisma.experienceUpdateInput) {
    try {
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
