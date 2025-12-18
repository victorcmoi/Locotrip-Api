import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        booking: {
          connect: { id: createConversationDto.booking_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.conversation.findMany({
      include: {
        booking: {
          include: {
            experience: true,
            user: true,
          },
        },
        messages: true,
      },
    });
  }

  async findOne(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            experience: {
              include: {
                guide: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            user: true,
          },
        },
        messages: {
          include: {
            author: true,
          },
          orderBy: { sent_at: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation avec l'ID ${id} introuvable`);
    }

    return conversation;
  }

  async findByBooking(bookingId: string) {
    return this.prisma.conversation.findMany({
      where: { booking_id: bookingId },
      include: {
        messages: {
          include: {
            author: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    try {
      return await this.prisma.conversation.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Conversation avec l'ID ${id} introuvable`);
    }
  }
}
