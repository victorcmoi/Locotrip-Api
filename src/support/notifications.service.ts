import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        type: createNotificationDto.type,
        content: createNotificationDto.content,
        read: createNotificationDto.read ?? false,
        user: {
          connect: { id: createNotificationDto.user_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }

    return notification;
  }

  async findByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { sent_at: 'desc' },
    });
  }

  async findNonLues(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        user_id: userId,
        read: false,
      },
      orderBy: { sent_at: 'desc' },
    });
  }

  async marquerCommeLue(id: string) {
    try {
      return await this.prisma.notification.update({
        where: { id },
        data: { read: true },
      });
    } catch (error) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      const data: any = { ...updateNotificationDto };

      // Transformer l'ID en relation si présent
      if (updateNotificationDto.user_id) {
        data.user = { connect: { id: updateNotificationDto.user_id } };
        delete data.user_id;
      }

      return await this.prisma.notification.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.notification.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }
  }
}
