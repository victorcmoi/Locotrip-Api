import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAbonnementDto } from './dto/create-abonnement.dto';
import { UpdateAbonnementDto } from './dto/update-abonnement.dto';

@Injectable()
export class AbonnementsService {
  constructor(private prisma: PrismaService) {}

  async create(createAbonnementDto: CreateAbonnementDto) {
    return this.prisma.abonnement.create({
      data: {
        type_abonnement: createAbonnementDto.type_abonnement,
        date_debut: createAbonnementDto.date_debut,
        date_fin: createAbonnementDto.date_fin,
        statut: createAbonnementDto.statut,
        utilisateur: {
          connect: { id: createAbonnementDto.utilisateur_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.abonnement.findMany({
      include: {
        utilisateur: true,
      },
    });
  }

  async findOne(id: string) {
    const abonnement = await this.prisma.abonnement.findUnique({
      where: { id },
      include: {
        utilisateur: true,
      },
    });

    if (!abonnement) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} introuvable`);
    }

    return abonnement;
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.abonnement.findMany({
      where: { utilisateur_id: utilisateurId },
      orderBy: { date_debut: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.abonnement.findMany({
      where: {
        statut: 'actif',
        date_fin: { gte: new Date() },
      },
      include: {
        utilisateur: true,
      },
    });
  }

  async update(id: string, updateAbonnementDto: UpdateAbonnementDto) {
    try {
      const data: any = { ...updateAbonnementDto };
      
      // Transformer l'ID en relation si présent
      if (updateAbonnementDto.utilisateur_id) {
        data.utilisateur = { connect: { id: updateAbonnementDto.utilisateur_id } };
        delete data.utilisateur_id;
      }
      
      return await this.prisma.abonnement.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.abonnement.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Abonnement avec l'ID ${id} introuvable`);
    }
  }
}
