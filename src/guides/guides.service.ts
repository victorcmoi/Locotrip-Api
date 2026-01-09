import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { FindAllGuidesDto } from './dto/find-all-guides.dto';
import {
  guideUncheckedUpdateInput,
  guideWhereInput,
} from '../generated/prisma/models/guide';
import {
  PaginatedResponse,
  PaginationMeta,
} from '../common/interfaces/paginated-response.interface';

@Injectable()
export class GuidesService {
  constructor(private prisma: PrismaService) {}

  async create(createGuideDto: CreateGuideDto) {
    return this.prisma.guide.create({
      data: {
        bio: createGuideDto.bio,
        languages: createGuideDto.languages,
        years_of_experience: createGuideDto.years_of_experience,
        guide_status: createGuideDto.guide_status,
        pro_card: createGuideDto.pro_card,
        country: createGuideDto.country,
        internal_comment: createGuideDto.internal_comment,
        user: {
          connect: { id: createGuideDto.user_id },
        },
      },
    });
  }

  async findAll(query: FindAllGuidesDto): Promise<PaginatedResponse<any>> {
    const {
      page = 1,
      limit = 20,
      sort = 'created_at',
      order = 'desc',
      minRating,
      minReviews,
      country,
      languages,
      search,
      minExperience,
    } = query;

    const where: guideWhereInput = {
      is_active: true,
    };

    if (country) {
      where.country = country;
    }

    if (minExperience !== undefined) {
      where.years_of_experience = {
        gte: minExperience,
      };
    }

    const orConditions: guideWhereInput[] = [];

    if (languages) {
      const languageList = languages.split(',').map((l) => l.trim());
      languageList.forEach((lang) => {
        orConditions.push({
          languages: { contains: lang, mode: 'insensitive' },
        });
      });
    }

    if (search) {
      orConditions.push(
        { bio: { contains: search, mode: 'insensitive' } },
        { user: { first_name: { contains: search, mode: 'insensitive' } } },
        { user: { last_name: { contains: search, mode: 'insensitive' } } },
      );
    }

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    const skip = (page - 1) * limit;

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[sort] = order as 'asc' | 'desc';

    const [data, total] = await Promise.all([
      this.prisma.guide.findMany({
        where,
        include: {
          user: true,
          documents: true,
          availabilities: true,
          boosts: true,
          experiences: {
            include: {
              reviews: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.guide.count({ where }),
    ]);

    let filteredData = data;
    if (minRating !== undefined || minReviews !== undefined) {
      filteredData = data.filter((guide) => {
        const allReviews = guide.experiences.flatMap((exp) => exp.reviews);
        const reviewCount = allReviews.length;
        const avgRating =
          reviewCount > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
            : 0;

        if (minRating !== undefined && avgRating < minRating) return false;
        if (minReviews !== undefined && reviewCount < minReviews) return false;
        return true;
      });
    }

    return {
      data: filteredData,
      meta: new PaginationMeta(page, limit, total),
    };
  }

  async findOne(id: string) {
    const guide = await this.prisma.guide.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        documents: true,
        availabilities: true,
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

    if (!guide.is_active) {
      throw new NotFoundException(`Guide avec l'ID ${id} n'est plus actif`);
    }

    return guide;
  }

  /**
   * Récupère les top N guides basés sur une note pondérée
   * Utilise une approche bayésienne : (R * v + C * m) / (v + m)
   * où R = note moyenne, v = nombre de votes, C = note moyenne globale, m = nombre minimum de votes
   */
  async findTopRated(limit = 5, minReviews = 1) {
    const guides = await this.prisma.guide.findMany({
      where: {
        is_active: true,
      },
      include: {
        user: true,
        experiences: {
          include: {
            reviews: true,
          },
        },
      },
    });

    // Calcule la note moyenne globale
    const allReviews = guides.flatMap((g) =>
      g.experiences.flatMap((e) => e.reviews),
    );
    const globalAverage =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 3.5;

    // Calcule le score pondéré pour chaque guide
    const guidesWithScore = guides
      .map((guide) => {
        const reviews = guide.experiences.flatMap((exp) => exp.reviews);
        const reviewCount = reviews.length;
        const avgRating =
          reviewCount > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
            : 0;

        const weightedScore =
          (avgRating * reviewCount + globalAverage * minReviews) /
          (reviewCount + minReviews);

        return {
          ...guide,
          reviewCount,
          avgRating,
          weightedScore,
        };
      })
      .filter((g) => g.reviewCount >= minReviews)
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .slice(0, limit);

    return guidesWithScore;
  }

  async findByUser(userId: string) {
    const guide = await this.prisma.guide.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        user: true,
        documents: true,
        availabilities: true,
        experiences: true,
      },
    });

    if (!guide) {
      throw new NotFoundException(
        `Aucun profil guide trouvé pour l'utilisateur ${userId}`,
      );
    }

    if (!guide.is_active) {
      throw new NotFoundException(
        `Le profil guide de l'utilisateur ${userId} n'est plus actif`,
      );
    }

    return guide;
  }

  async update(id: string, updateGuideDto: UpdateGuideDto) {
    try {
      const data: guideUncheckedUpdateInput = { ...updateGuideDto };

      return await this.prisma.guide.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.guide.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }
  }

  async softDelete(id: string, reason?: string) {
    try {
      return await this.prisma.guide.update({
        where: { id },
        data: {
          is_active: false,
          suspended_at: new Date(),
          suspension_reason: reason || 'Guide suspendu',
        },
      });
    } catch {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }
  }

  async restore(id: string) {
    try {
      return await this.prisma.guide.update({
        where: { id },
        data: {
          is_active: true,
          suspended_at: null,
          suspension_reason: null,
        },
      });
    } catch {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }
  }

  /**
   * Récupère tous les guides (actifs et inactifs)
   */
  async findAllIncludingDeleted() {
    return this.prisma.guide.findMany({
      include: {
        user: true,
        documents: true,
        availabilities: true,
        boosts: true,
        experiences: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
