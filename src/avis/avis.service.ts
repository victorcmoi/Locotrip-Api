import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAvisDto } from './dto/create-avis.dto';
import { UpdateAvisDto } from './dto/update-avis.dto';

@Injectable()
export class AvisService {
  constructor(private prisma: PrismaService) {}

  async create(createAvisDto: CreateAvisDto) {
    return this.prisma.avis.create({
      data: {
        note: createAvisDto.note,
        commentaire: createAvisDto.commentaire,
        utilisateur: {
          connect: { id: createAvisDto.utilisateur_id },
        },
        experience: {
          connect: { id: createAvisDto.experience_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.avis.findMany({
      include: {
        utilisateur: true,
        experience: true,
      },
    });
  }

  async findOne(id: string) {
    const avis = await this.prisma.avis.findUnique({
      where: { id },
      include: {
        utilisateur: true,
        experience: true,
      },
    });

    if (!avis) {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }

    return avis;
  }

  async findByExperience(experienceId: string) {
    return this.prisma.avis.findMany({
      where: { experience_id: experienceId },
      include: {
        utilisateur: true,
      },
      orderBy: { date_avis: 'desc' },
    });
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.avis.findMany({
      where: { utilisateur_id: utilisateurId },
      include: {
        experience: true,
      },
    });
  }

  async update(id: string, updateAvisDto: UpdateAvisDto) {
    try {
      const data: any = { ...updateAvisDto };
      
      // Transformer les IDs en relations si présents
      if (updateAvisDto.utilisateur_id) {
        data.utilisateur = { connect: { id: updateAvisDto.utilisateur_id } };
        delete data.utilisateur_id;
      }
      
      if (updateAvisDto.experience_id) {
        data.experience = { connect: { id: updateAvisDto.experience_id } };
        delete data.experience_id;
      }
      
      return await this.prisma.avis.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.avis.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }
  }
}
