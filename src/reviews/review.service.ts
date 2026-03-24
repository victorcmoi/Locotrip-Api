import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { reviewUncheckedUpdateInput } from '../generated/prisma/models/review';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../support/notifications.service';
import { NotificationType } from '../support/enums/notification.enum';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const { user_id, experience_id, rating, title, comment } = createReviewDto;

    // Fetch experience title for better error messages
    const experience = await this.prisma.experience.findUnique({
      where: { id: experience_id },
      select: { title: true },
    });
    const experienceTitle = experience?.title || 'cette expérience';

    // 1. Check if the user has a completed booking for this experience
    const completedBooking = await this.prisma.booking.findFirst({
      where: {
        user_id,
        experience_id,
        status: 'completed',
      },
    });

    if (!completedBooking) {
      throw new ForbiddenException(
        `Vous devez avoir participé à l'expérience "${experienceTitle}" (réservation terminée) pour laisser un avis.`,
      );
    }

    // 2. Check if the user has already left a review for this experience
    const existingReview = await this.prisma.review.findFirst({
      where: {
        user_id,
        experience_id,
      },
    });

    if (existingReview) {
      const formattedDate = existingReview.review_date.toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      throw new BadRequestException(
        `Vous avez déjà publié un avis pour l'expérience "${experienceTitle}" le ${formattedDate}.`,
      );
    }

    // 3. Create the review
    const review = await this.prisma.review.create({
      data: {
        rating,
        title,
        comment,
        user: { connect: { id: user_id } },
        experience: { connect: { id: experience_id } },
      },
      include: {
        user: true,
        experience: {
          include: {
            city: true,
            guide: {
              include: { user: true }
            }
          }
        }
      }
    });

    // 4. Send email and in-app notifications to the guide
    const guideUser = review.experience?.guide?.user;
    if (guideUser) {
      // Send in-app notification
      this.notificationsService
        .create({
          type: NotificationType.NEW_REVIEW,
          content: `Vous avez reçu un nouvel avis (${review.rating} étoiles) de ${review.user.first_name} pour l'expérience "${review.experience.title}".`,
          user_id: guideUser.id,
        })
        .catch((e) =>
          this.logger.error(
            `Erreur lors de la création de la notification de nouvel avis pour le guide`,
            e,
          ),
        );

      // Send email
      if (guideUser.email) {
        this.mailService
          .sendNewReviewEmail(guideUser.email, {
            clientName: `${review.user.first_name} ${review.user.last_name}`,
            rating: review.rating,
            comment: review.comment || '',
            experienceName: review.experience.title,
          })
          .catch((e) =>
            this.logger.error(
              `Erreur lors de l'envoi de l'email de nouvel avis au guide ${guideUser.email}`,
              e,
            ),
          );
      }
    }

    return review;
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        user: true,
        experience: true,
        media: true,
      },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        experience: true,
        media: true,
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
        media: true,
      },
      orderBy: { review_date: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { user_id: userId },
      include: {
        experience: true,
        media: true,
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
        media: true,
        experience: {
          include: {
            city: true,
            guide: {
              include: {
                user: true,
              },
            },
          },
        },
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
