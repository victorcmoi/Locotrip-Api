import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AbonnementsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.abonnementCreateInput) {
    return this.prisma.abonnement.create({ data });
  }

  async findAll() {
    return this.prisma.abonnement.findMany({
      include: {
        utilisateur: true,
      },
    });
  }

  async findOne(id: string) {
    const abonnement = await this.prisma.abonnement.findUnique({
      where: { id },
      include: {
        utilisateur: true,
      },
    });

    if (!abonnement) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} introuvable`);
    }

    return abonnement;
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.abonnement.findMany({
      where: { utilisateur_id: utilisateurId },
      orderBy: { date_debut: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.abonnement.findMany({
      where: {
        statut: 'actif',
        date_fin: { gte: new Date() },
      },
      include: {
        utilisateur: true,
      },
    });
  }

  async update(id: string, data: Prisma.abonnementUpdateInput) {
    try {
      return await this.prisma.abonnement.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.abonnement.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} introuvable`);
    }
  }
}
