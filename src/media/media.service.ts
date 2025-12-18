import { UpdateMediaDto } from './dto/update-media.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MediaType } from './enums/media.enum';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async create(createMediaDto: CreateMediaDto) {
    return this.prisma.media.create({ data: createMediaDto });
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

  async findByType(typeMedia: MediaType) {
    return this.prisma.media.findMany({
      where: { media_type: typeMedia },
    });
  }

  async update(id: string, data: UpdateMediaDto) {
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
