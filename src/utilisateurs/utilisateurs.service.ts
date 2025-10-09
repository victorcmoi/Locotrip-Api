import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilisateursService {
  constructor(private prisma: PrismaService) {}

  async create(createUtilisateurDto: CreateUtilisateurDto) {
    const hashedPassword = await bcrypt.hash(createUtilisateurDto.mot_de_passe, 10);
    
    return this.prisma.utilisateur.create({ 
      data: {
        ...createUtilisateurDto,
        mot_de_passe: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.utilisateur.findMany({
      include: {
        guides: true,
        reservations: true,
        avis: true,
        abonnements: true,
      },
    });
  }

  async findOne(id: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id },
      include: {
        guides: true,
        reservations: true,
        avis: true,
        abonnements: true,
        support_tickets: true,
        notifications: true,
      },
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }

    return utilisateur;
  }

  async findByEmail(email: string) {
    return this.prisma.utilisateur.findUnique({
      where: { email },
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async update(id: string, updateUtilisateurDto: UpdateUtilisateurDto) {
    try {
      const data = { ...updateUtilisateurDto };
      
      if (updateUtilisateurDto.mot_de_passe) {
        data.mot_de_passe = await bcrypt.hash(updateUtilisateurDto.mot_de_passe, 10);
      }
      
      return await this.prisma.utilisateur.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.utilisateur.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }
}
