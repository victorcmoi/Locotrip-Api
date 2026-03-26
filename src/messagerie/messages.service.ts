import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { NotificationsService } from '../support/notifications.service';
import { NotificationType } from '../support/enums/notification.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private mailService: MailService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = await this.prisma.message.create({
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

    const conversationDetails = await this.prisma.conversation.findUnique({
      where: { id: createMessageDto.conversation_id },
      include: {
        booking: {
          include: {
            user: true,
            experience: {
              include: {
                guide: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const authorDoc = await this.prisma.user.findUnique({
      where: { id: createMessageDto.author_id },
      select: { first_name: true },
    });

    if (conversationDetails && authorDoc) {
      const clientUser = conversationDetails.booking.user;
      const guideUser = conversationDetails.booking.experience.guide.user;

      const recipient =
        message.author_id === clientUser.id ? guideUser : clientUser;

      if (recipient) {
        // App-level notification
        this.notificationsService
          .create({
            user_id: recipient.id,
            type: NotificationType.NEW_MESSAGE,
            content: `Vous avez reçu un nouveau message de ${authorDoc.first_name}`,
          })
          .catch((e) => console.error('Failed to create notification', e));

        // Email notification
        const now = new Date();
        const timestamp = `${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;

        this.mailService
          .sendNewMessageEmail(recipient.email, {
            senderName: authorDoc.first_name,
            messageContent: message.content,
            timestamp: timestamp,
          })
          .catch((e) => console.error('Failed to send new message email', e));
      }
    }

    return message;
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
    } catch {
      throw new NotFoundException(`Message avec l'ID ${id} introuvable`);
    }
  }

  async markAsRead(conversationId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        conversation_id: conversationId,
        author_id: { not: userId },
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });
  }
}
