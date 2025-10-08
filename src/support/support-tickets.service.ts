import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SupportTicketsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.support_ticketCreateInput) {
    return this.prisma.support_ticket.create({ data });
  }

  async findAll() {
    return this.prisma.support_ticket.findMany({
      include: {
        utilisateur: true,
        messages: true,
      },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.support_ticket.findUnique({
      where: { id },
      include: {
        utilisateur: true,
        messages: {
          include: {
            auteur: true,
          },
          orderBy: { date_envoi: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket avec l'ID ${id} introuvable`);
    }

    return ticket;
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.support_ticket.findMany({
      where: { utilisateur_id: utilisateurId },
      include: {
        messages: true,
      },
      orderBy: { date_creation: 'desc' },
    });
  }

  async findByStatut(statut: string) {
    return this.prisma.support_ticket.findMany({
      where: { statut },
      include: {
        utilisateur: true,
      },
      orderBy: { date_creation: 'desc' },
    });
  }

  async update(id: string, data: Prisma.support_ticketUpdateInput) {
    try {
      return await this.prisma.support_ticket.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Ticket avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.support_ticket.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Ticket avec l'ID ${id} introuvable`);
    }
  }
}
