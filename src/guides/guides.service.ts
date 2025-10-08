import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';

@Injectable()
export class GuidesService {
  constructor(private prisma: PrismaService) {}

  async create(createGuideDto: CreateGuideDto) {
    return this.prisma.guide.create({
      data: {
        bio: createGuideDto.bio,
        langues: createGuideDto.langues,
        experience_annees: createGuideDto.experience_annees,
        statut_guide: createGuideDto.statut_guide,
        carte_pro: createGuideDto.carte_pro,
        pays: createGuideDto.pays,
        commentaire_interne: createGuideDto.commentaire_interne,
        utilisateur: {
          connect: { id: createGuideDto.utilisateur_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.guide.findMany({
      include: {
        utilisateur: true,
        documents: true,
        disponibilites: true,
        boosts: true,
        experiences: true,
      },
    });
  }

  async findOne(id: string) {
    const guide = await this.prisma.guide.findUnique({
      where: { id },
      include: {
        utilisateur: true,
        documents: true,
        disponibilites: true,
        boosts: {
          include: {
            boost_offer: true,
          },
        },
        experiences: true,
      },
    });

    if (!guide) {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }

    return guide;
  }

  async findByUtilisateur(utilisateurId: string) {
    return this.prisma.guide.findMany({
      where: { utilisateur_id: utilisateurId },
      include: {
        documents: true,
        disponibilites: true,
        experiences: true,
      },
    });
  }

  async update(id: string, updateGuideDto: UpdateGuideDto) {
    try {
      const data: any = { ...updateGuideDto };
      
      // Transformer l'ID en relation si présent
      if (updateGuideDto.utilisateur_id) {
        data.utilisateur = { connect: { id: updateGuideDto.utilisateur_id } };
        delete data.utilisateur_id;
      }
      
      return await this.prisma.guide.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.guide.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }
  }
}
