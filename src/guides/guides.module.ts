import { Module } from '@nestjs/common';
import { GuidesController, BoostOffersController } from './guides.controller';
import { GuidesService } from './guides.service';
import { GuideDocumentsService } from './guide-documents.service';
import { GuideAvailabilityService } from './guide-availability.service';
import { BoostOffersService } from './boost-offers.service';
import { GuideBoostsService } from './guide-boosts.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [GuidesController, BoostOffersController],
  providers: [
    GuidesService,
    GuideDocumentsService,
    GuideAvailabilityService,
    BoostOffersService,
    GuideBoostsService,
    PrismaService,
  ],
  exports: [
    GuidesService,
    GuideDocumentsService,
    GuideAvailabilityService,
    BoostOffersService,
    GuideBoostsService,
  ],
})
export class GuidesModule {}
