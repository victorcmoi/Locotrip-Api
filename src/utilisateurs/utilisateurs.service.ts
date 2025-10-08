import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UtilisateursService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.utilisateurCreateInput) {
    return this.prisma.utilisateur.create({ data });
  }

  async findAll() {
    return this.prisma.utilisateur.findMany({
      include: {
        guides: true,
        reservations: true,
        avis: true,
        abonnements: true,
      },
    });
  }

  async findOne(id: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id },
      include: {
        guides: true,
        reservations: true,
        avis: true,
        abonnements: true,
        support_tickets: true,
        notifications: true,
      },
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }

    return utilisateur;
  }

  async findByEmail(email: string) {
    return this.prisma.utilisateur.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: Prisma.utilisateurUpdateInput) {
    try {
      return await this.prisma.utilisateur.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.utilisateur.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }
}
