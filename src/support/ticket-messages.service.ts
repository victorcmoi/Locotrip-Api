import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';

@Injectable()
export class TicketMessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketMessageDto: CreateTicketMessageDto) {
    return this.prisma.ticket_message.create({
      data: {
        content: createTicketMessageDto.content,
        ticket: {
          connect: { id: createTicketMessageDto.ticket_id },
        },
        author: {
          connect: { id: createTicketMessageDto.author_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.ticket_message.findMany({
      include: {
        ticket: true,
        author: true,
      },
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.ticket_message.findUnique({
      where: { id },
      include: {
        ticket: true,
        author: true,
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
        author: true,
      },
      orderBy: { sent_at: 'asc' },
    });
  }

  async delete(id: string) {
    try {
      return await this.prisma.ticket_message.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Message avec l'ID ${id} introuvable`);
    }
  }
}
