import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { reviewUncheckedUpdateInput } from '../generated/prisma/models/review';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        rating: createReviewDto.rating,
        title: createReviewDto.title,
        comment: createReviewDto.comment,
        user: {
          connect: { id: createReviewDto.user_id },
        },
        experience: {
          connect: { id: createReviewDto.experience_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        user: true,
        experience: true,
      },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        experience: true,
      },
    });

    if (!review) {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }

    return review;
  }

  async findByExperience(experienceId: string) {
    return this.prisma.review.findMany({
      where: { experience_id: experienceId },
      include: {
        user: true,
      },
      orderBy: { review_date: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { user_id: userId },
      include: {
        experience: true,
      },
    });
  }

  async update(id: string, UpdateReviewDto: UpdateReviewDto) {
    try {
      const data: reviewUncheckedUpdateInput = { ...UpdateReviewDto };

      return await this.prisma.review.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.review.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }
  }

  async findTopReviews(limit = 3, minDescriptionLength = 40) {
    const reviews = await this.prisma.review.findMany({
      where: {
        rating: 5,
        comment: {
          not: null,
        },
      },
      include: {
        user: true,
        experience: true,
      },
      orderBy: {
        review_date: 'desc',
      },
    });

    const filteredReviews = reviews.filter(
      (review) =>
        review.comment && review.comment.length >= minDescriptionLength,
    );

    return filteredReviews.slice(0, limit);
  }
}
