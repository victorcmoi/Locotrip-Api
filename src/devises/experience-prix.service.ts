import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExperiencePrixDto } from './dto/create-experience-prix.dto';
import { UpdateExperiencePrixDto } from './dto/update-experience-prix.dto';

@Injectable()
export class ExperiencePrixService {
  constructor(private prisma: PrismaService) {}

  async create(createExperiencePrixDto: CreateExperiencePrixDto) {
    return this.prisma.experience_prix.create({
      data: {
        prix: createExperiencePrixDto.prix,
        experience: {
          connect: { id: createExperiencePrixDto.experience_id },
        },
        devise: {
          connect: { code: createExperiencePrixDto.devise_code },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.experience_prix.findMany({
      include: {
        experience: true,
        devise: true,
      },
    });
  }

  async findByExperience(experienceId: string) {
    return this.prisma.experience_prix.findMany({
      where: { experience_id: experienceId },
      include: {
        devise: true,
      },
    });
  }

  async findByDevise(deviseCode: string) {
    return this.prisma.experience_prix.findMany({
      where: { devise_code: deviseCode },
      include: {
        experience: true,
      },
    });
  }

  async update(experienceId: string, deviseCode: string, updateExperiencePrixDto: UpdateExperiencePrixDto) {
    const data: any = { prix: updateExperiencePrixDto.prix };
    
    // Transformer les IDs en relations si présents
    if (updateExperiencePrixDto.experience_id) {
      data.experience = { connect: { id: updateExperiencePrixDto.experience_id } };
    }
    
    if (updateExperiencePrixDto.devise_code) {
      data.devise = { connect: { code: updateExperiencePrixDto.devise_code } };
    }
    
    return this.prisma.experience_prix.update({
      where: {
        experience_id_devise_code: {
          experience_id: experienceId,
          devise_code: deviseCode,
        },
      },
      data,
    });
  }

  async delete(experienceId: string, deviseCode: string) {
    return this.prisma.experience_prix.delete({
      where: {
        experience_id_devise_code: {
          experience_id: experienceId,
          devise_code: deviseCode,
        },
      },
    });
  }
}
