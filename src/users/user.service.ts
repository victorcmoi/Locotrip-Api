import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { userWhereInput } from '../generated/prisma/models/user';
import {
  PaginatedResponse,
  PaginationMeta,
} from '../common/interfaces/paginated-response.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll(query: FindAllUsersDto): Promise<PaginatedResponse<any>> {
    const {
      page = 1,
      limit = 20,
      sort = 'created_at',
      order = 'desc',
      role,
      search,
      isActive,
      isVerified,
    } = query;

    // Construction des filtres WHERE
    const where: userWhereInput = {};

    if (isActive !== undefined) {
      where.is_active = isActive;
    } else {
      where.is_active = true;
    }

    if (role) {
      where.role = role;
    }

    if (isVerified !== undefined) {
      where.is_verified = isVerified;
    }

    // Recherche textuelle
    if (search) {
      where.OR = [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Construction du tri
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[sort] = order as 'asc' | 'desc';

    // Requêtes parallèles
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          guides: true,
          bookings: true,
          reviews: true,
          subscriptions: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: new PaginationMeta(page, limit, total),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        is_active: true,
      },
      include: {
        guides: true,
        bookings: true,
        reviews: true,
        subscriptions: true,
        support_tickets: true,
        notifications: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const data = { ...updateUserDto };

      if (updateUserDto.password) {
        data.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }

  async softDelete(id: string, reason?: string) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          is_active: false,
          deleted_at: new Date(),
          deleted_reason: reason || 'Compte désactivé',
        },
      });
    } catch {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }

  async restore(id: string) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          is_active: true,
          deleted_at: null,
          deleted_reason: null,
        },
      });
    } catch {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }

  async verifyEmail(id: string) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          is_verified: true,
        },
      });
    } catch {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }

  async findAllIncludingDeleted() {
    return this.prisma.user.findMany({
      include: {
        guides: true,
        bookings: true,
        reviews: true,
        subscriptions: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
