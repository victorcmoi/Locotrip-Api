import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.reservationCreateInput) {
    return this.prisma.reservation.create({ data });
  }

  async findAll() {
    return this.prisma.reservation.findMany({
      include: {
        utilisateur: true,
        experience: {
          include: {
            guide: {
              include: {
                utilisateur: true,
              },
            },
            ville: true,
          },
        },
        paiements: true,
      },
    });
  }

  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        utilisateur: true,
        experience: {
          include: {
            guide: {
              include: {
                utilisateur: true,
              },
            },
            ville: true,
          },
        },
        paiements: true,
        litiges: true,
        conversations: {
          include: {
            messages: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} introuvable`);
    }

    return reservation;
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.reservation.findMany({
      where: { utilisateur_id: utilisateurId },
      include: {
        experience: {
          include: {
            guide: {
              include: {
                utilisateur: true,
              },
            },
            ville: true,
          },
        },
        paiements: true,
      },
      orderBy: { date_reservation: 'desc' },
    });
  }

  async findByExperience(experienceId: string) {
    return this.prisma.reservation.findMany({
      where: { experience_id: experienceId },
      include: {
        utilisateur: true,
        paiements: true,
      },
    });
  }

  async update(id: string, data: Prisma.reservationUpdateInput) {
    try {
      return await this.prisma.reservation.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Réservation avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.reservation.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Réservation avec l'ID ${id} introuvable`);
    }
  }
}
