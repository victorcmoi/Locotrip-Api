import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LitigesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.litigeCreateInput) {
    return this.prisma.litige.create({ data });
  }

  async findAll() {
    return this.prisma.litige.findMany({
      include: {
        reservation: {
          include: {
            experience: true,
          },
        },
        utilisateur: true,
        admin: true,
      },
    });
  }

  async findOne(id: string) {
    const litige = await this.prisma.litige.findUnique({
      where: { id },
      include: {
        reservation: {
          include: {
            experience: true,
            utilisateur: true,
          },
        },
        utilisateur: true,
        admin: true,
      },
    });

    if (!litige) {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }

    return litige;
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.litige.findMany({
      where: { utilisateur_id: utilisateurId },
      include: {
        reservation: {
          include: {
            experience: true,
          },
        },
      },
    });
  }

  async findByStatut(statut: string) {
    return this.prisma.litige.findMany({
      where: { statut },
      include: {
        reservation: {
          include: {
            experience: true,
          },
        },
        utilisateur: true,
      },
    });
  }

  async update(id: string, data: Prisma.litigeUpdateInput) {
    try {
      return await this.prisma.litige.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.litige.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }
  }
}
