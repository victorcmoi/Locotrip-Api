import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';

@Injectable()
export class GuidesService {
  constructor(private prisma: PrismaService) {}

  async create(createGuideDto: CreateGuideDto) {
    return this.prisma.guide.create({
      data: {
        bio: createGuideDto.bio,
        languages: createGuideDto.languages,
        years_of_experience: createGuideDto.years_of_experience,
        guide_status: createGuideDto.guide_status,
        pro_card: createGuideDto.pro_card,
        country: createGuideDto.country,
        internal_comment: createGuideDto.internal_comment,
        user: {
          connect: { id: createGuideDto.user_id },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.guide.findMany({
      include: {
        user: true,
        documents: true,
        availabilities: true,
        boosts: true,
        experiences: true,
      },
    });
  }

  async findOne(id: string) {
    const guide = await this.prisma.guide.findUnique({
      where: { id },
      include: {
        user: true,
        documents: true,
        availabilities: true,
        boosts: {
          include: {
            boost_offer: true,
          },
        },
        experiences: true,
      },
    });

    if (!guide) {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }

    return guide;
  }

  async findByUser(userId: string) {
    return this.prisma.guide.findMany({
      where: { user_id: userId },
      include: {
        documents: true,
        availabilities: true,
        experiences: true,
      },
    });
  }

  async update(id: string, updateGuideDto: UpdateGuideDto) {
    try {
      const data: any = { ...updateGuideDto };
      
      // Transformer l'ID en relation si présent
      if (updateGuideDto.user_id) {
        data.user = { connect: { id: updateGuideDto.user_id } };
        delete data.user_id;
      }
      
      return await this.prisma.guide.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.guide.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Guide avec l'ID ${id} introuvable`);
    }
  }
}
