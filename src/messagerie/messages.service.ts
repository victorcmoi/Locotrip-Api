import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.messageCreateInput) {
    return this.prisma.message.create({ data });
  }

  async findAll() {
    return this.prisma.message.findMany({
      include: {
        conversation: true,
        auteur: true,
      },
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        conversation: true,
        auteur: true,
      },
    });

    if (!message) {
      throw new NotFoundException(`Message avec l'ID ${id} introuvable`);
    }

    return message;
  }

  async findByConversation(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversation_id: conversationId },
      include: {
        auteur: true,
      },
      orderBy: { date_envoi: 'asc' },
    });
  }

  async delete(id: string) {
    try {
      return await this.prisma.message.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Message avec l'ID ${id} introuvable`);
    }
  }
}
