import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        conversation: {
          connect: { id: createMessageDto.conversation_id },
        },
        author: {
          connect: { id: createMessageDto.author_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.message.findMany({
      include: {
        conversation: true,
        author: true,
      },
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        conversation: true,
        author: true,
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
        author: true,
      },
      orderBy: { sent_at: 'asc' },
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
