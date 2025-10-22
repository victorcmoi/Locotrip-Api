import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        rating: createReviewDto.rating,
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
      const data: any = { ...UpdateReviewDto };
      
      // Transformer les IDs en relations si présents
      if (UpdateReviewDto.user_id) {
        data.user = { connect: { id: UpdateReviewDto.user_id } };
        delete data.user_id;
      }
      
      if (UpdateReviewDto.experience_id) {
        data.experience = { connect: { id: UpdateReviewDto.experience_id } };
        delete data.experience_id;
      }
      
      return await this.prisma.review.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.review.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Avis avec l'ID ${id} introuvable`);
    }
  }
}
