import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.notificationCreateInput) {
    return this.prisma.notification.create({ data });
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

  async update(id: string, data: Prisma.notificationUpdateInput) {
    try {
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
