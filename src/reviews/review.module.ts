import { Module } from '@nestjs/common';
import { ReviewsController, AbonnementsController } from './review.controller';
import { ReviewService } from './review.service';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ReviewsController, AbonnementsController],
  providers: [ReviewService, SubscriptionService, PrismaService],
  exports: [ReviewService, SubscriptionService],
})
export class ReviewsModule {}
