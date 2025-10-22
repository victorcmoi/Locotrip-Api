import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from './enums/booking.enum';

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

  async findAll() {
    return this.prisma.booking.findMany({
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
    });
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
      const data: any = { ...updateBookingDto };
      
      // Transformer les IDs en relations si présents
      if (updateBookingDto.user_id) {
        data.user = { connect: { id: updateBookingDto.user_id } };
        delete data.user_id;
      }
      
      if (updateBookingDto.experience_id) {
        data.experience = { connect: { id: updateBookingDto.experience_id } };
        delete data.experience_id;
      }
      
      return await this.prisma.booking.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Réservation avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.booking.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Réservation avec l'ID ${id} introuvable`);
    }
  }
}
