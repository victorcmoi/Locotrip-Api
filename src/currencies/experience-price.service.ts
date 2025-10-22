import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExperiencePriceDto } from './dto/create-experience-price.dto';
import { UpdateExperiencePriceDto } from './dto/update-experience-price.dto';

@Injectable()
export class experiencePriceService {
  constructor(private prisma: PrismaService) {}

  async create(createExperiencePrixDto: CreateExperiencePriceDto) {
    return this.prisma.experience_price.create({
      data: {
        price: createExperiencePrixDto.price,
        experience: {
          connect: { id: createExperiencePrixDto.experience_id },
        },
        currency: {
          connect: { code: createExperiencePrixDto.currency_code },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.experience_price.findMany({
      include: {
        experience: true,
        currency: true,
      },
    });
  }

  async findByExperience(experienceId: string) {
    return this.prisma.experience_price.findMany({
      where: { experience_id: experienceId },
      include: {
        currency: true,
      },
    });
  }

  async findByCurrency(currencyCode: string) {
    return this.prisma.experience_price.findMany({
      where: { currency_code: currencyCode },
      include: {
        experience: true,
      },
    });
  }

  async update(experienceId: string, currencyCode: string, updateExperiencePrixDto: UpdateExperiencePriceDto) {
    const data: any = { price: updateExperiencePrixDto.price };
    
    // Transformer les IDs en relations si présents
    if (updateExperiencePrixDto.experience_id) {
      data.experience = { connect: { id: updateExperiencePrixDto.experience_id } };
    }
    
    if (updateExperiencePrixDto.currency_code) {
      data.currency = { connect: { code: updateExperiencePrixDto.currency_code } };
    }
    
    return this.prisma.experience_price.update({
      where: {
        experience_id_currency_code: {
          experience_id: experienceId,
          currency_code: currencyCode,
        },
      },
      data,
    });
  }

  async delete(experienceId: string, currencyCode: string) {
    return this.prisma.experience_price.delete({
      where: {
        experience_id_currency_code: {
          experience_id: experienceId,
          currency_code: currencyCode,
        },
      },
    });
  }
}
