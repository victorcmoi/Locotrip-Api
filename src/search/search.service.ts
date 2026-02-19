import { Injectable, BadRequestException } from '@nestjs/common';
import { SearchDto, SearchMode } from './dto/search.dto';
import { PrismaService } from '../prisma.service';
import {
    PaginatedResponse,
    PaginationMeta,
} from '../common/interfaces/paginated-response.interface';
import { guideWhereInput } from '../generated/prisma/models/guide';
import { experienceWhereInput } from '../generated/prisma/models/experience';

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) { }

    async search(searchDto: SearchDto): Promise<PaginatedResponse<any>> {
        if (searchDto.mode === SearchMode.GUIDE) {
            return this.searchGuides(searchDto);
        } else if (searchDto.mode === SearchMode.EXPERIENCE) {
            return this.searchExperiences(searchDto);
        }

        throw new BadRequestException(
            `Mode de recherche invalide: ${searchDto.mode}`,
        );
    }

    private async searchGuides(
        searchDto: SearchDto,
    ): Promise<PaginatedResponse<any>> {
        const {
            page = 1,
            limit = 20,
            sort = 'created_at',
            order = 'desc',
            minRating,
            minReviews,
            location,
            startDate,
            endDate,
            languages,
            minExperience,
            search,
        } = searchDto;

        const where: guideWhereInput = {
            is_active: true,
        };

        // Filtrage par années d'expérience
        if (minExperience !== undefined) {
            where.years_of_experience = {
                gte: minExperience,
            };
        }

        // Filtrage par langues et recherche textuelle
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

        // Filtrage par localisation et/ou dates
        if (location || startDate || endDate) {
            const experienceConditions: experienceWhereInput = {};

            if (location) {
                experienceConditions.city = {
                    name: {
                        startsWith: location,
                        mode: 'insensitive',
                    },
                };
            }

            if (startDate || endDate) {
                const searchStart = startDate || endDate;
                const searchEnd = endDate || startDate;

                experienceConditions.availabilities = {
                    some: {
                        status: 'available',
                        start_date: { lte: searchEnd },
                        end_date: { gte: searchStart },
                    },
                };
            }

            where.experiences = {
                some: experienceConditions,
            };
        }

        const skip = (page - 1) * limit;

        const orderBy: Record<string, 'asc' | 'desc'> = {};
        orderBy[sort] = order as 'asc' | 'desc';

        const [data, total] = await Promise.all([
            this.prisma.guide.findMany({
                where,
                include: {
                    user: true,
                    medias: true,
                    documents: true,
                    boosts: true,
                    hobbies: {
                        include: {
                            category: true,
                        },
                    },
                    experiences: {
                        include: {
                            reviews: true,
                            availabilities:
                                startDate || endDate
                                    ? {
                                        where: {
                                            status: 'available',
                                            start_date: { lte: endDate || startDate },
                                            end_date: { gte: startDate || endDate },
                                        },
                                    }
                                    : true,
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

        // Filtrage post-requête par rating et nombre d'avis
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

        // Ajouter reviewCount et prix des expériences
        const dataWithReviewCount = filteredData.map((guide) => {
            const reviewCount = guide.experiences.reduce(
                (total, exp) => total + exp.reviews.length,
                0,
            );

            const experiencePrices = guide.experiences
                .filter((exp) => exp.is_active && exp.is_published)
                .map((exp) => exp.price.toNumber());

            const minPrice =
                experiencePrices.length > 0 ? Math.min(...experiencePrices) : null;
            const maxPrice =
                experiencePrices.length > 0 ? Math.max(...experiencePrices) : null;

            return {
                ...guide,
                reviewCount,
                minExperiencePrice: minPrice,
                maxExperiencePrice: maxPrice,
            };
        });

        return {
            data: dataWithReviewCount,
            meta: new PaginationMeta(page, limit, total),
        };
    }

    private async searchExperiences(
        searchDto: SearchDto,
    ): Promise<PaginatedResponse<any>> {
        const {
            page = 1,
            limit = 20,
            sort = 'created_at',
            order = 'desc',
            minRating,
            minPrice,
            maxPrice,
            location,
            startDate,
            endDate,
            categories,
            search,
            minDuration,
            maxDuration,
            maxParticipants,
        } = searchDto;

        const where: experienceWhereInput = {
            is_active: true,
            is_published: true,
            guide: {
                is_active: true,
            },
        };

        // Filtrage par localisation
        if (location) {
            where.city = {
                name: {
                    startsWith: location,
                    mode: 'insensitive',
                },
            };
        }

        // Filtrage par dates de disponibilité
        if (startDate || endDate) {
            const searchStart = startDate || endDate;
            const searchEnd = endDate || startDate;

            where.availabilities = {
                some: {
                    status: 'available',
                    start_date: { lte: searchEnd },
                    end_date: { gte: searchStart },
                },
            };
        }

        // Filtrage par prix
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = minPrice;
            if (maxPrice !== undefined) where.price.lte = maxPrice;
        }

        // Filtrage par durée
        if (minDuration !== undefined || maxDuration !== undefined) {
            where.duration = {};
            if (minDuration !== undefined) where.duration.gte = minDuration;
            if (maxDuration !== undefined) where.duration.lte = maxDuration;
        }

        // Filtrage par capacité
        if (maxParticipants !== undefined) {
            where.max_capacity = {
                gte: maxParticipants,
            };
        }

        // Filtrage par catégories
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

        const skip = (page - 1) * limit;

        const orderBy: Record<string, 'asc' | 'desc'> = {};
        orderBy[sort] = order as 'asc' | 'desc';

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
                    availabilities:
                        startDate || endDate
                            ? {
                                where: {
                                    status: 'available',
                                    start_date: { lte: endDate || startDate },
                                    end_date: { gte: startDate || endDate },
                                },
                            }
                            : true,
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
}
