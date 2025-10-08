import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBoostOfferDto } from './dto/create-boost-offer.dto';
import { UpdateBoostOfferDto } from './dto/update-boost-offer.dto';

@Injectable()
export class BoostOffersService {
  constructor(private prisma: PrismaService) {}

  async create(createBoostOfferDto: CreateBoostOfferDto) {
    return this.prisma.boost_offer.create({
      data: createBoostOfferDto,
    });
  }

  async findAll() {
    return this.prisma.boost_offer.findMany();
  }

  async findOne(id: string) {
    const offer = await this.prisma.boost_offer.findUnique({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException(`Offre de boost avec l'ID ${id} introuvable`);
    }

    return offer;
  }

  async update(id: string, updateBoostOfferDto: UpdateBoostOfferDto) {
    try {
      return await this.prisma.boost_offer.update({
        where: { id },
        data: updateBoostOfferDto,
      });
    } catch (error) {
      throw new NotFoundException(`Offre de boost avec l'ID ${id} introuvable`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.boost_offer.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Offre de boost avec l'ID ${id} introuvable`);
    }
  }
}
