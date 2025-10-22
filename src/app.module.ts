import { Module } from '@nestjs/common';
import { UsersModule } from './users/user.module';
import { GuidesModule } from './guides/guides.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/review.module';
import { MessagerieModule } from './messagerie/messagerie.module';
import { SupportModule } from './support/support.module';
import { MediaModule } from './media/media.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { AuthentificationModule } from './auth/authentifucation.module';

@Module({
  imports: [
    UsersModule,
    GuidesModule,
    ExperiencesModule,
    BookingsModule,
    ReviewsModule,
    MessagerieModule,
    SupportModule,
    MediaModule,
    CurrenciesModule,
    AuthentificationModule,
  ],
})
export class AppModule {}
