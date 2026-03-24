import { Module, forwardRef } from '@nestjs/common';
import { ReviewsController, AbonnementsController } from './review.controller';
import { ReviewService } from './review.service';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../prisma.service';
import { SupportModule } from '../support/support.module';

@Module({
  imports: [forwardRef(() => SupportModule)],
  controllers: [ReviewsController, AbonnementsController],
  providers: [ReviewService, SubscriptionService, PrismaService],
  exports: [ReviewService, SubscriptionService],
})
export class ReviewsModule {}
