import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, TypeMedia } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.mediaCreateInput) {
    return this.prisma.media.create({ data });
  }

  async findAll() {
    return this.prisma.media.findMany();
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException(`Media avec l'ID ${id} introuvable`);
    }

    return media;
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.media.findMany({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
    });
  }

  async findByType(typeMedia: TypeMedia) {
    return this.prisma.media.findMany({
      where: { type_media: typeMedia },
    });
  }

  async update(id: string, data: Prisma.mediaUpdateInput) {
    try {
      return await this.prisma.media.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Media avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.media.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Media avec l'ID ${id} introuvable`);
    }
  }
}
