import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FindAllBookingsDto } from './dto/find-all-bookings.dto';
import { BookingStatus } from './enums/booking.enum';
import { NotificationsService } from '../support/notifications.service';
import { NotificationType } from '../support/enums/notification.enum';
import { MailService } from '../mail/mail.service';
import {
  bookingUncheckedUpdateInput,
  bookingWhereInput,
} from '../generated/prisma/models/booking';
import {
  PaginatedResponse,
  PaginationMeta,
} from '../common/interfaces/paginated-response.interface';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private mailService: MailService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const booking = await this.prisma.booking.create({
      data: {
        booking_date: createBookingDto.booking_date,
        number_of_participants: createBookingDto.number_of_participants,
        total_price: createBookingDto.total_price,
        status: BookingStatus.PENDING,
        user: {
          connect: { id: createBookingDto.user_id },
        },
        experience: {
          connect: { id: createBookingDto.experience_id },
        },
      },
      include: {
        user: true,
        experience: {
          include: {
            guide: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    // Notify guide
    const bookingDate = new Date(booking.booking_date);
    const dateFormatted = bookingDate.toLocaleDateString('fr-FR');
    const timeFormatted = bookingDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await this.notificationsService.create({
      user_id: booking.experience.guide.user_id,
      type: NotificationType.BOOKING_REMINDER,
      content: `Nouvelle réservation : ${booking.experience.title} le ${dateFormatted} à ${timeFormatted} par ${booking.user.first_name} ${booking.user.last_name}`,
    });

    await this.mailService
      .sendNewBookingForGuideEmail(booking.experience.guide.user.email, {
        guideName: booking.experience.guide.user.first_name,
        clientName: `${booking.user.first_name} ${booking.user.last_name}`,
        experienceName: booking.experience.title,
        date: dateFormatted,
        bookingId: booking.id,
      })
      .catch((e) =>
        console.error('Failed to send new booking email to guide', e),
      );

    return booking;
  }

  async findAll(query: FindAllBookingsDto): Promise<PaginatedResponse<any>> {
    const {
      page = 1,
      limit = 20,
      sort = 'booking_date',
      order = 'desc',
      userId,
      experienceId,
      status,
      startDate,
      endDate,
    } = query;

    // Construction des filtres WHERE
    const where: bookingWhereInput = {};

    if (userId) {
      where.user_id = userId;
    }

    if (experienceId) {
      where.experience_id = experienceId;
    }

    if (status) {
      where.status = status;
    }

    // Filtre par dates
    if (startDate || endDate) {
      where.booking_date = {};
      if (startDate) {
        where.booking_date.gte = new Date(startDate);
      }
      if (endDate) {
        where.booking_date.lte = new Date(endDate);
      }
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Construction du tri
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[sort] = order as 'asc' | 'desc';

    // Requêtes parallèles
    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          user: true,
          experience: {
            include: {
              guide: {
                include: {
                  user: true,
                },
              },
              city: true,
            },
          },
          payments: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data,
      meta: new PaginationMeta(page, limit, total),
    };
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        experience: {
          include: {
            guide: {
              include: {
                user: true,
              },
            },
            city: true,
          },
        },
        payments: true,
        disputes: true,
        conversations: {
          include: {
            messages: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Réservation avec l'ID ${id} introuvable`);
    }

    return booking;
  }

  async findByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { user_id: userId },
      include: {
        experience: {
          include: {
            guide: {
              include: {
                user: true,
              },
            },
            city: true,
            medias: true,
          },
        },
        payments: true,
      },
      orderBy: { booking_date: 'desc' },
    });
  }

  async findByGuide(guideId: string) {
    return this.prisma.booking.findMany({
      where: {
        experience: { guide_id: guideId },
      },
      include: {
        user: true,
        experience: {
          include: {
            city: true,
            medias: true,
          },
        },
        payments: true,
      },
      orderBy: { booking_date: 'desc' },
    });
  }

  async findByExperience(experienceId: string) {
    return this.prisma.booking.findMany({
      where: { experience_id: experienceId },
      include: {
        user: true,
        payments: true,
      },
    });
  }

  async countByExperience(experienceId: string) {
    return this.prisma.booking.count({
      where: { experience_id: experienceId },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    try {
      const data: bookingUncheckedUpdateInput = { ...updateBookingDto };

      const booking = await this.prisma.booking.update({
        where: { id },
        data,
        include: {
          experience: true,
          user: true,
        },
      });

      // Notify user if status changed
      if (updateBookingDto.status) {
        let content = '';
        if (updateBookingDto.status === BookingStatus.CONFIRMED) {
          content = `Votre réservation pour ${booking.experience.title} a été acceptée`;
        } else if (updateBookingDto.status === BookingStatus.CANCELLED) {
          content = `Votre réservation pour ${booking.experience.title} a été annulée`;
        }

        if (content) {
          await this.notificationsService.create({
            user_id: booking.user_id,
            type: NotificationType.BOOKING_REMINDER,
            content: content,
          });

          if (updateBookingDto.status === BookingStatus.CONFIRMED) {
            const bookingDate = new Date(booking.booking_date);
            const dateFormatted = bookingDate.toLocaleDateString('fr-FR');

            await this.mailService
              .sendBookingConfirmationEmail(booking.user.email, {
                userName: booking.user.first_name,
                experienceName: booking.experience.title,
                date: dateFormatted,
                price: `${booking.total_price}€`,
                bookingId: booking.id,
              })
              .catch((e) =>
                console.error('Failed to send confirmation email', e),
              );
          } else if (updateBookingDto.status === BookingStatus.CANCELLED) {
            const bookingDate = new Date(booking.booking_date);
            const dateFormatted = bookingDate.toLocaleDateString('fr-FR');

            await this.mailService
              .sendBookingCancelledEmail(booking.user.email, {
                userName: booking.user.first_name,
                experienceName: booking.experience.title,
                date: dateFormatted,
                bookingId: booking.id,
              })
              .catch((e) => console.error('Failed to send cancellation email', e));
          }
        }
      }

      return booking;
    } catch {
      throw new NotFoundException(`Réservation avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.booking.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Réservation avec l'ID ${id} introuvable`);
    }
  }
}
