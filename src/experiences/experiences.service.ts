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
  constructor(private prisma: PrismaService) { }

  async create(createExperienceDto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        title: createExperienceDto.title,
        description: createExperienceDto.description,
        additional_info: createExperienceDto.additional_info,
        is_accessible: createExperienceDto.is_accessible ?? false,
        price: createExperienceDto.price,
        duration: createExperienceDto.duration,
        max_capacity: createExperienceDto.max_capacity,
        meeting_point: createExperienceDto.meeting_point,
        meeting_latitude: createExperienceDto.meeting_latitude,
        meeting_longitude: createExperienceDto.meeting_longitude,
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
      cityId,
      guideId,
      is_published = true,
    } = query;

    // Construction des filtres WHERE
    const where: experienceWhereInput = {
      is_active: true,
      is_published,
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
          medias: true,
          reviews: true,
          steps: {
            orderBy: { step_number: 'asc' },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.experience.count({ where }),
    ]);

    return {
      data,
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
            medias: true,
          },
        },
        bookings: true,
        reviews: true,
        medias: true,
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
        steps: {
          orderBy: { step_number: 'asc' },
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

    // Calculer le reviewCount du guide
    const guideExperiences = await this.prisma.experience.findMany({
      where: {
        guide_id: experience.guide_id,
      },
      select: {
        reviews: {
          select: {
            id: true,
          },
        },
      },
    });

    const reviewCount = guideExperiences.reduce(
      (total, exp) => total + exp.reviews.length,
      0,
    );

    return {
      ...experience,
      guide: {
        ...experience.guide,
        reviewCount,
      },
    };
  }

  async findOneForGuide(id: string, guideId: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
      include: {
        city: true,
        guide: {
          include: {
            user: true,
            medias: true,
          },
        },
        bookings: true,
        reviews: {
          include: {
            user: true,
          },
        },
        medias: true,
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
        availabilities: {
          orderBy: {
            start_date: 'asc',
          },
        },
        steps: {
          orderBy: { step_number: 'asc' },
        },
      },
    });

    if (!experience) {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }

    if (experience.guide_id !== guideId) {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }

    // Calculer le reviewCount du guide
    const guideExperiences = await this.prisma.experience.findMany({
      where: {
        guide_id: experience.guide_id,
      },
      select: {
        reviews: {
          select: {
            id: true,
          },
        },
      },
    });

    const reviewCount = guideExperiences.reduce(
      (total, exp) => total + exp.reviews.length,
      0,
    );

    return {
      ...experience,
      guide: {
        ...experience.guide,
        reviewCount,
      },
    };
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
        medias: true,
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
        medias: true,
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            review_date: 'desc',
          },
        },
        bookings: {
          include: {
            user: true,
          },
          orderBy: {
            booking_date: 'desc',
          },
        },
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
        medias: true,
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
        medias: true,
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

  async findOneAdmin(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
      include: {
        city: true,
        guide: {
          include: {
            user: true,
          },
        },
        bookings: {
          include: {
            user: true,
          },
          orderBy: {
            booking_date: 'desc',
          },
        },
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            review_date: 'desc',
          },
        },
        medias: true,
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
        steps: {
          orderBy: { step_number: 'asc' },
        },
      },
    });

    if (!experience) {
      throw new NotFoundException(`Expérience avec l'ID ${id} introuvable`);
    }

    return experience;
  }

  async replaceSteps(
    experienceId: string,
    steps: { step_number: number; title: string; description?: string }[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.experience_step.deleteMany({
        where: { experience_id: experienceId },
      });

      if (steps.length > 0) {
        await tx.experience_step.createMany({
          data: steps.map((s) => ({
            experience_id: experienceId,
            step_number: s.step_number,
            title: s.title,
            description: s.description,
          })),
        });
      }

      return tx.experience_step.findMany({
        where: { experience_id: experienceId },
        orderBy: { step_number: 'asc' },
      });
    });
  }
}
