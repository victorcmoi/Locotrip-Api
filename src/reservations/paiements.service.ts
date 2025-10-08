import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaiementsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.paiementCreateInput) {
    return this.prisma.paiement.create({ data });
  }

  async findAll() {
    return this.prisma.paiement.findMany({
      include: {
        reservation: {
          include: {
            utilisateur: true,
            experience: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const paiement = await this.prisma.paiement.findUnique({
      where: { id },
      include: {
        reservation: {
          include: {
            utilisateur: true,
            experience: true,
          },
        },
      },
    });

    if (!paiement) {
      throw new NotFoundException(`Paiement avec l'ID ${id} introuvable`);
    }

    return paiement;
  }

  async findByReservation(reservationId: string) {
    return this.prisma.paiement.findMany({
      where: { reservation_id: reservationId },
    });
  }

  async update(id: string, data: Prisma.paiementUpdateInput) {
    try {
      return await this.prisma.paiement.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Paiement avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.paiement.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Paiement avec l'ID ${id} introuvable`);
    }
  }
}
