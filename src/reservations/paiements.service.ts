import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';

@Injectable()
export class PaiementsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaiementDto: CreatePaiementDto) {
    return this.prisma.paiement.create({
      data: {
        montant: createPaiementDto.montant,
        methode: createPaiementDto.methode,
        statut: createPaiementDto.statut,
        stripe_id: createPaiementDto.stripe_id,
        reservation: {
          connect: { id: createPaiementDto.reservation_id },
        },
      },
    });
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

  async update(id: string, updatePaiementDto: UpdatePaiementDto) {
    try {
      const data: any = { ...updatePaiementDto };
      
      // Transformer l'ID en relation si présent
      if (updatePaiementDto.reservation_id) {
        data.reservation = { connect: { id: updatePaiementDto.reservation_id } };
        delete data.reservation_id;
      }
      
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
