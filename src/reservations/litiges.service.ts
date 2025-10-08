import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateLitigeDto } from './dto/create-litige.dto';
import { UpdateLitigeDto } from './dto/update-litige.dto';

@Injectable()
export class LitigesService {
  constructor(private prisma: PrismaService) {}

  async create(createLitigeDto: CreateLitigeDto) {
    const data: any = {
      motif: createLitigeDto.motif,
      statut: createLitigeDto.statut,
      reservation: {
        connect: { id: createLitigeDto.reservation_id },
      },
      utilisateur: {
        connect: { id: createLitigeDto.utilisateur_id },
      },
    };
    
    // Ajouter l'admin si fourni
    if (createLitigeDto.admin_id) {
      data.admin = { connect: { id: createLitigeDto.admin_id } };
    }
    
    return this.prisma.litige.create({ data });
  }

  async findAll() {
    return this.prisma.litige.findMany({
      include: {
        reservation: {
          include: {
            experience: true,
          },
        },
        utilisateur: true,
        admin: true,
      },
    });
  }

  async findOne(id: string) {
    const litige = await this.prisma.litige.findUnique({
      where: { id },
      include: {
        reservation: {
          include: {
            experience: true,
            utilisateur: true,
          },
        },
        utilisateur: true,
        admin: true,
      },
    });

    if (!litige) {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }

    return litige;
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.litige.findMany({
      where: { utilisateur_id: utilisateurId },
      include: {
        reservation: {
          include: {
            experience: true,
          },
        },
      },
    });
  }

  async findByStatut(statut: string) {
    return this.prisma.litige.findMany({
      where: { statut },
      include: {
        reservation: {
          include: {
            experience: true,
          },
        },
        utilisateur: true,
      },
    });
  }

  async update(id: string, updateLitigeDto: UpdateLitigeDto) {
    try {
      const data: any = { ...updateLitigeDto };
      
      // Transformer les IDs en relations si présents
      if (updateLitigeDto.reservation_id) {
        data.reservation = { connect: { id: updateLitigeDto.reservation_id } };
        delete data.reservation_id;
      }
      
      if (updateLitigeDto.utilisateur_id) {
        data.utilisateur = { connect: { id: updateLitigeDto.utilisateur_id } };
        delete data.utilisateur_id;
      }
      
      if (updateLitigeDto.admin_id) {
        data.admin = { connect: { id: updateLitigeDto.admin_id } };
        delete data.admin_id;
      }
      
      return await this.prisma.litige.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.litige.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }
  }
}
