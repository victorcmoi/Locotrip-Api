import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { SupportTicketStatus } from '@prisma/client';

@Injectable()
export class SupportTicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createSupportTicketDto: CreateSupportTicketDto) {
    return this.prisma.support_ticket.create({
      data: {
        subject: createSupportTicketDto.subject,
        status: createSupportTicketDto.status,
        user: {
          connect: { id: createSupportTicketDto.user_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.support_ticket.findMany({
      include: {
        user: true,
        messages: true,
      },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.support_ticket.findUnique({
      where: { id },
      include: {
        user: true,
        messages: {
          include: {
            author: true,
          },
          orderBy: { sent_at: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket avec l'ID ${id} introuvable`);
    }

    return ticket;
  }

  async findByUser(userId: string) {
    return this.prisma.support_ticket.findMany({
      where: { user_id: userId },
      include: {
        messages: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByStatut(status: SupportTicketStatus) {
    return this.prisma.support_ticket.findMany({
      where: { status },
      include: {
        user: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, updateData: Partial<CreateSupportTicketDto>) {
    try {
      const data: any = { ...updateData };
      
      // Transformer l'ID en relation si présent
      if (updateData.user_id) {
        data.user = { connect: { id: updateData.user_id } };
        delete data.user_id;
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
