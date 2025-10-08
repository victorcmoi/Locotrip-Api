import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        reservation: {
          connect: { id: createConversationDto.reservation_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.conversation.findMany({
      include: {
        reservation: {
          include: {
            experience: true,
            utilisateur: true,
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
        reservation: {
          include: {
            experience: {
              include: {
                guide: {
                  include: {
                    utilisateur: true,
                  },
                },
              },
            },
            utilisateur: true,
          },
        },
        messages: {
          include: {
            auteur: true,
          },
          orderBy: { date_envoi: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation avec l'ID ${id} introuvable`);
    }

    return conversation;
  }

  async findByReservation(reservationId: string) {
    return this.prisma.conversation.findMany({
      where: { reservation_id: reservationId },
      include: {
        messages: {
          include: {
            auteur: true,
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
    } catch (error) {
      throw new NotFoundException(`Conversation avec l'ID ${id} introuvable`);
    }
  }
}
