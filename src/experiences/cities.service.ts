import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { FindAllCitiesDto } from './dto/find-all-cities.dto';
import { cityWhereInput } from '../generated/prisma/models/city';
import {
  PaginatedResponse,
  PaginationMeta,
} from '../common/interfaces/paginated-response.interface';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) { }

  async create(createCityDto: CreateCityDto) {
    return this.prisma.city.create({
      data: createCityDto,
    });
  }

  async findAll(query: FindAllCitiesDto): Promise<PaginatedResponse<any>> {
    const {
      page = 1,
      limit = 20,
      sort = 'name',
      order = 'asc',
      country,
      search,
    } = query;

    // Construction des filtres WHERE
    const where: cityWhereInput = {};

    if (country) {
      where.country = country;
    }

    if (search) {
      where.name = {
        startsWith: search,
        mode: 'insensitive',
      };
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Construction du tri
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[sort] = order as 'asc' | 'desc';

    // Requêtes parallèles
    const [data, total] = await Promise.all([
      this.prisma.city.findMany({
        where,
        include: {
          experiences: true,
          image: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.city.count({ where }),
    ]);

    return {
      data,
      meta: new PaginationMeta(page, limit, total),
    };
  }

  async findOne(id: string) {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        experiences: true,
        image: true,
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

  async findSuggested(): Promise<PaginatedResponse<any>> {
    const data = await this.prisma.city.findMany({
      where: {
        is_suggested: true,
        is_active: true,
      } as any,
      include: {
        image: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return {
      data,
      meta: new PaginationMeta(1, data.length, data.length),
    };
  }
}
