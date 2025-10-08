import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateVilleDto } from './dto/create-ville.dto';
import { UpdateVilleDto } from './dto/update-ville.dto';

@Injectable()
export class VillesService {
  constructor(private prisma: PrismaService) {}

  async create(createVilleDto: CreateVilleDto) {
    return this.prisma.ville.create({
      data: createVilleDto,
    });
  }

  async findAll() {
    return this.prisma.ville.findMany({
      include: {
        experiences: true,
      },
    });
  }

  async findOne(id: string) {
    const ville = await this.prisma.ville.findUnique({
      where: { id },
      include: {
        experiences: true,
      },
    });

    if (!ville) {
      throw new NotFoundException(`Ville avec l'ID ${id} introuvable`);
    }

    return ville;
  }

  async update(id: string, updateVilleDto: UpdateVilleDto) {
    try {
      return await this.prisma.ville.update({
        where: { id },
        data: updateVilleDto,
      });
    } catch (error) {
      throw new NotFoundException(`Ville avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.ville.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Ville avec l'ID ${id} introuvable`);
    }
  }
}
