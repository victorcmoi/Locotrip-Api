import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FindAllBookingsDto } from './dto/find-all-bookings.dto';
import { BookingStatus } from './enums/booking.enum';
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
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    return this.prisma.booking.create({
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
    });
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

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    try {
      const data: bookingUncheckedUpdateInput = { ...updateBookingDto };

      return await this.prisma.booking.update({
        where: { id },
        data,
      });
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
