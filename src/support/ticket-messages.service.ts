import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';

@Injectable()
export class TicketMessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketMessageDto: CreateTicketMessageDto) {
    return this.prisma.ticket_message.create({
      data: {
        contenu: createTicketMessageDto.contenu,
        ticket: {
          connect: { id: createTicketMessageDto.ticket_id },
        },
        auteur: {
          connect: { id: createTicketMessageDto.auteur_id },
        },
      },
    });
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
