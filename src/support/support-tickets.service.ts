import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';

@Injectable()
export class SupportTicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createSupportTicketDto: CreateSupportTicketDto) {
    return this.prisma.support_ticket.create({
      data: {
        sujet: createSupportTicketDto.sujet,
        statut: createSupportTicketDto.statut,
        utilisateur: {
          connect: { id: createSupportTicketDto.utilisateur_id },
        },
      },
    });
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

  async update(id: string, updateData: Partial<CreateSupportTicketDto>) {
    try {
      const data: any = { ...updateData };
      
      // Transformer l'ID en relation si présent
      if (updateData.utilisateur_id) {
        data.utilisateur = { connect: { id: updateData.utilisateur_id } };
        delete data.utilisateur_id;
      }
      
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
