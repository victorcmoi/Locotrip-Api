import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGuideDocumentDto } from './dto/create-guide-document.dto';

@Injectable()
export class GuideDocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(createGuideDocumentDto: CreateGuideDocumentDto) {
    return this.prisma.guide_document.create({
      data: {
        document_type: createGuideDocumentDto.document_type,
        verification_status: createGuideDocumentDto.verification_status || 'pending',
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

  async update(id: string, updateData: Partial<CreateGuideDocumentDto>) {
    try {
      const data: any = { ...updateData };
      
      // Transformer l'ID en relation si présent
      if (updateData.guide_id) {
        data.guide = { connect: { id: updateData.guide_id } };
        delete data.guide_id;
      }
      
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
