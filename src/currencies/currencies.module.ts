import { Module } from '@nestjs/common';
import {
  CurrenciesController,
  ExperiencePrixController,
} from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { experiencePriceService } from './experience-price.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CurrenciesController, ExperiencePrixController],
  providers: [CurrenciesService, experiencePriceService, PrismaService],
  exports: [CurrenciesService, experiencePriceService],
})
export class CurrenciesModule {}
