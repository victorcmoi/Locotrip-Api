import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGuideDocumentDto } from './dto/create-guide-document.dto';
import { guide_documentUncheckedUpdateInput } from '../generated/prisma/models/guide_document';

@Injectable()
export class GuideDocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(createGuideDocumentDto: CreateGuideDocumentDto) {
    return this.prisma.guide_document.create({
      data: {
        document_type: createGuideDocumentDto.document_type,
        verification_status:
          createGuideDocumentDto.verification_status || 'pending',
        verification_comment: createGuideDocumentDto.verification_comment,
        guide: {
          connect: { id: createGuideDocumentDto.guide_id },
        },
      },
    });
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

  async update(id: string, updateData: guide_documentUncheckedUpdateInput) {
    try {
      return await this.prisma.guide_document.update({
        where: { id },
        data: updateData,
      });
    } catch {
      throw new NotFoundException(`Document avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.guide_document.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Document avec l'ID ${id} introuvable`);
    }
  }
}
