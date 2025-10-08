import { Module } from '@nestjs/common';
import { ReservationsController, PaiementsController, LitigesController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { PaiementsService } from './paiements.service';
import { LitigesService } from './litiges.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ReservationsController, PaiementsController, LitigesController],
  providers: [
    ReservationsService,
    PaiementsService,
    LitigesService,
    PrismaService,
  ],
  exports: [
    ReservationsService,
    PaiementsService,
    LitigesService,
  ],
})
export class ReservationsModule {}
