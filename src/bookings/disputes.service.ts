import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { disputeUncheckedUpdateInput } from '../generated/prisma/models/dispute';
import { DisputeStatus } from './enums/dispute.enum';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async create(createDisputeDto: CreateDisputeDto) {
    return this.prisma.dispute.create({
      data: createDisputeDto,
    });
  }

  async findAll() {
    return this.prisma.dispute.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        booking: {
          include: {
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
        },
        user: true,
        admin: true,
      },
    });
  }

  async findOne(id: string) {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            experience: true,
            user: true,
          },
        },
        user: true,
        admin: true,
      },
    });

    if (!dispute) {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }

    return dispute;
  }

  async findByUser(userId: string) {
    return this.prisma.dispute.findMany({
      where: { user_id: userId },
      include: {
        booking: {
          include: {
            experience: true,
          },
        },
      },
    });
  }

  async findByStatut(status: DisputeStatus) {
    return this.prisma.dispute.findMany({
      where: { status },
      include: {
        booking: {
          include: {
            experience: true,
          },
        },
        user: true,
      },
    });
  }

  async update(id: string, updateDisputeDto: UpdateDisputeDto) {
    try {
      const data: disputeUncheckedUpdateInput = { ...updateDisputeDto };

      return await this.prisma.dispute.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.dispute.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }
  }
}
