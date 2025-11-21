import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        is_active: true,
      },
      include: {
        guides: true,
        bookings: true,
        reviews: true,
        subscriptions: true,
      },
    });
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

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
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
    } catch (error) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
