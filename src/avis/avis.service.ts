import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AvisService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.avisCreateInput) {
    return this.prisma.avis.create({ data });
  }

  async findAll() {
    return this.prisma.avis.findMany({
      include: {
        utilisateur: true,
        experience: true,
      },
    });
  }

  async findOne(id: string) {
    const avis = await this.prisma.avis.findUnique({
      where: { id },
      include: {
        utilisateur: true,
        experience: true,
      },
    });

    if (!avis) {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }

    return avis;
  }

  async findByExperience(experienceId: string) {
    return this.prisma.avis.findMany({
      where: { experience_id: experienceId },
      include: {
        utilisateur: true,
      },
      orderBy: { date_avis: 'desc' },
    });
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.avis.findMany({
      where: { utilisateur_id: utilisateurId },
      include: {
        experience: true,
      },
    });
  }

  async update(id: string, data: Prisma.avisUpdateInput) {
    try {
      return await this.prisma.avis.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.avis.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }
  }
}
