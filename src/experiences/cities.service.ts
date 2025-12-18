import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createCityDto: CreateCityDto) {
    return this.prisma.city.create({
      data: createCityDto,
    });
  }

  async findAll() {
    return this.prisma.city.findMany({
      include: {
        experiences: true,
      },
    });
  }

  async findOne(id: string) {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        experiences: true,
      },
    });

    if (!city) {
      throw new NotFoundException(`Ville avec l'ID ${id} introuvable`);
    }

    return city;
  }

  async update(id: string, updateVilleDto: UpdateCityDto) {
    try {
      return await this.prisma.city.update({
        where: { id },
        data: updateVilleDto,
      });
    } catch {
      throw new NotFoundException(`Ville avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.city.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Ville avec l'ID ${id} introuvable`);
    }
  }
}
