import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { StatutReservation } from './enums/reservation.enum';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto) {
    return this.prisma.reservation.create({
      data: {
        date_reservation: createReservationDto.date_reservation,
        nombre_participants: createReservationDto.nombre_participants,
        prix_total: createReservationDto.prix_total,
        statut: StatutReservation.EN_ATTENTE,
        utilisateur: {
          connect: { id: createReservationDto.utilisateur_id },
        },
        experience: {
          connect: { id: createReservationDto.experience_id },
        },
      },
    });
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

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    try {
      const data: any = { ...updateReservationDto };
      
      // Transformer les IDs en relations si présents
      if (updateReservationDto.utilisateur_id) {
        data.utilisateur = { connect: { id: updateReservationDto.utilisateur_id } };
        delete data.utilisateur_id;
      }
      
      if (updateReservationDto.experience_id) {
        data.experience = { connect: { id: updateReservationDto.experience_id } };
        delete data.experience_id;
      }
      
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
