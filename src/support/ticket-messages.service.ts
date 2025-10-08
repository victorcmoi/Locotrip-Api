import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TicketMessagesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ticket_messageCreateInput) {
    return this.prisma.ticket_message.create({ data });
  }

  async findAll() {
    return this.prisma.ticket_message.findMany({
      include: {
        ticket: true,
        auteur: true,
      },
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.ticket_message.findUnique({
      where: { id },
      include: {
        ticket: true,
        auteur: true,
      },
    });

    if (!message) {
      throw new NotFoundException(`Message avec l'ID ${id} introuvable`);
    }

    return message;
  }

  async findByTicket(ticketId: string) {
    return this.prisma.ticket_message.findMany({
      where: { ticket_id: ticketId },
      include: {
        auteur: true,
      },
      orderBy: { date_envoi: 'asc' },
    });
  }

  async delete(id: string) {
    try {
      return await this.prisma.ticket_message.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Message avec l'ID ${id} introuvable`);
    }
  }
}
