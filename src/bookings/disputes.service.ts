import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { DisputeStatus } from './enums/dispute.enum';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async create(createDisputeDto: CreateDisputeDto) {
    const data: any = {
      reason: createDisputeDto.reason,
      status: createDisputeDto.status,
      booking: {
        connect: { id: createDisputeDto.booking_id },
      },
      user: {
        connect: { id: createDisputeDto.user_id },
      },
    };

    // Ajouter l'admin si fourni
    if (createDisputeDto.admin_id) {
      data.admin = { connect: { id: createDisputeDto.admin_id } };
    }

    return this.prisma.dispute.create({ data });
  }

  async findAll() {
    return this.prisma.dispute.findMany({
      include: {
        booking: {
          include: {
            experience: true,
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
      const data: any = { ...updateDisputeDto };

      // Transformer les IDs en relations si présents
      if (updateDisputeDto.booking_id) {
        data.booking = { connect: { id: updateDisputeDto.booking_id } };
        delete data.booking_id;
      }

      if (updateDisputeDto.user_id) {
        data.user = { connect: { id: updateDisputeDto.user_id } };
        delete data.user_id;
      }

      if (updateDisputeDto.admin_id) {
        data.admin = { connect: { id: updateDisputeDto.admin_id } };
        delete data.admin_id;
      }

      return await this.prisma.dispute.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.dispute.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Litige avec l'ID ${id} introuvable`);
    }
  }
}
