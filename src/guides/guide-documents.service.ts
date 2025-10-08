import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GuideDocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.guide_documentCreateInput) {
    return this.prisma.guide_document.create({ data });
  }

  async findAll() {
    return this.prisma.guide_document.findMany({
      include: {
        guide: true,
      },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.guide_document.findUnique({
      where: { id },
      include: {
        guide: true,
      },
    });

    if (!document) {
      throw new NotFoundException(`Document avec l'ID ${id} introuvable`);
    }

    return document;
  }

  async findByGuide(guideId: string) {
    return this.prisma.guide_document.findMany({
      where: { guide_id: guideId },
    });
  }

  async update(id: string, data: Prisma.guide_documentUpdateInput) {
    try {
      return await this.prisma.guide_document.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Document avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.guide_document.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Document avec l'ID ${id} introuvable`);
    }
  }
}
