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
        contenu: createNotificationDto.contenu,
        lu: createNotificationDto.lu ?? false,
        utilisateur: {
          connect: { id: createNotificationDto.utilisateur_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        utilisateur: true,
      },
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        utilisateur: true,
      },
    });

    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }

    return notification;
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.notification.findMany({
      where: { utilisateur_id: utilisateurId },
      orderBy: { date_envoi: 'desc' },
    });
  }

  async findNonLues(utilisateurId: string) {
    return this.prisma.notification.findMany({
      where: {
        utilisateur_id: utilisateurId,
        lu: false,
      },
      orderBy: { date_envoi: 'desc' },
    });
  }

  async marquerCommeLue(id: string) {
    try {
      return await this.prisma.notification.update({
        where: { id },
        data: { lu: true },
      });
    } catch (error) {
      throw new NotFoundException(`Notification avec l'ID ${id} introuvable`);
    }
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      const data: any = { ...updateNotificationDto };
      
      // Transformer l'ID en relation si présent
      if (updateNotificationDto.utilisateur_id) {
        data.utilisateur = { connect: { id: updateNotificationDto.utilisateur_id } };
        delete data.utilisateur_id;
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
