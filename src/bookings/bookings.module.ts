import { Module } from '@nestjs/common';
import { BookingsController, PaiementsController, DisputesController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PaymentsService } from './payments.service';
import { DisputesService } from './disputes.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BookingsController, PaiementsController, DisputesController],
  providers: [
    BookingsService,
    PaymentsService,
    DisputesService,
    PrismaService,
  ],
  exports: [
    BookingsService,
    PaymentsService,
    DisputesService,
  ],
})
export class BookingsModule {}
