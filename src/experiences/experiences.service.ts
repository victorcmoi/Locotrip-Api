import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { FindAllExperiencesDto } from './dto/find-all-experiences.dto';
import {
  experienceUncheckedUpdateInput,
  experienceWhereInput,
} from '../generated/prisma/models/experience';
import {
  PaginatedResponse,
  PaginationMeta,
} from '../common/interfaces/paginated-response.interface';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  async create(createExperienceDto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        title: createExperienceDto.title,
        description: createExperienceDto.description,
        price: createExperienceDto.price,
        duration: createExperienceDto.duration,
        max_capacity: createExperienceDto.max_capacity,
        city: {
          connect: { id: createExperienceDto.city_id },
        },
        guide: {
          connect: { id: createExperienceDto.guide_id },
        },
      },
    });
  }

  async findAll(query: FindAllExperiencesDto): Promise<PaginatedResponse<any>> {
    const {
      page = 1,
      limit = 20,
      sort = 'created_at',
      order = 'desc',
      minRating,
      minPrice,
      maxPrice,
      cityId,
      guideId,
      categories,
      search,
      minDuration,
      maxDuration,
      maxParticipants,
      available,
    } = query;

    // Construction des filtres WHERE
    const where: experienceWhereInput = {
      is_active: true,
      is_published: true,
      guide: {
        is_active: true,
      },
    };

    if (cityId) {
      where.city_id = cityId;
    }

    if (guideId) {
      where.guide_id = guideId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (minDuration !== undefined || maxDuration !== undefined) {
      where.duration = {};
      if (minDuration !== undefined) where.duration.gte = minDuration;
      if (maxDuration !== undefined) where.duration.lte = maxDuration;
    }

    if (maxParticipants !== undefined) {
      where.max_capacity = {
        gte: maxParticipants,
      };
    }

    if (available !== undefined && available) {
      where.is_published = true;
    }

    // Filtre par catégories
    if (categories) {
      const categoryIds = categories.split(',').map((c) => c.trim());
      where.categories = {
        some: {
          category_id: {
            in: categoryIds,
          },
        },
      };
    }

    // Recherche textuelle
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Construction du tri
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[sort] = order as 'asc' | 'desc';

    // Requêtes parallèles
    const [data, total] = await Promise.all([
      this.prisma.experience.findMany({
        where,
        include: {
          city: true,
          guide: {
            include: {
              user: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          reviews: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.experience.count({ where }),
    ]);

    // Filtrage post-requête pour minRating
    let filteredData = data;
    if (minRating !== undefined) {
      filteredData = data.filter((experience) => {
        const reviews = experience.reviews;
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
        return avgRating >= minRating;
      });
    }

    return {
      data: filteredData,
      meta: new PaginationMeta(page, limit, total),
    };
  }

  async findOne(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
      include: {
        city: true,
        guide: {
          include: {
            user: true,
          },
        },
        bookings: true,
        reviews: true,
        categories: {
          include: {
            category: true,
          },
        },
        currency_prices: {
          include: {
            currency: true,
          },
        },
      },
    });

    if (!experience) {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }

    if (!experience.is_active || !experience.is_published) {
      throw new NotFoundException(
        `Expérience avec l'ID ${id} n'est plus disponible`,
      );
    }

    return experience;
  }

  async findByVille(villeId: string) {
    return this.prisma.experience.findMany({
      where: {
        city_id: villeId,
        is_active: true,
        is_published: true,
        guide: {
          is_active: true,
        },
      },
      include: {
        guide: {
          include: {
            user: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findByGuide(guideId: string) {
    return this.prisma.experience.findMany({
      where: {
        guide_id: guideId,
        is_active: true,
      },
      include: {
        city: true,
        reviews: true,
      },
    });
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    try {
      const data: experienceUncheckedUpdateInput = { ...updateExperienceDto };

      return await this.prisma.experience.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.experience.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }
  }

  async softDelete(id: string) {
    try {
      return await this.prisma.experience.update({
        where: { id },
        data: {
          is_active: false,
          deleted_at: new Date(),
        },
      });
    } catch {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }
  }

  async restore(id: string) {
    try {
      return await this.prisma.experience.update({
        where: { id },
        data: {
          is_active: true,
          deleted_at: null,
        },
      });
    } catch {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }
  }

  async publish(id: string) {
    try {
      return await this.prisma.experience.update({
        where: { id },
        data: {
          is_published: true,
        },
      });
    } catch {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }
  }

  async unpublish(id: string) {
    try {
      return await this.prisma.experience.update({
        where: { id },
        data: {
          is_published: false,
        },
      });
    } catch {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }
  }

  async findAllIncludingDeleted() {
    return this.prisma.experience.findMany({
      include: {
        city: true,
        guide: {
          include: {
            user: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        reviews: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findDraftsByGuide(guideId: string) {
    return this.prisma.experience.findMany({
      where: {
        guide_id: guideId,
        is_active: true,
        is_published: false,
      },
      include: {
        city: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
  }
}
