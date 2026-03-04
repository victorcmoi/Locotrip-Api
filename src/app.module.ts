import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/user.module';
import { GuidesModule } from './guides/guides.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/review.module';
import { MessagerieModule } from './messagerie/messagerie.module';
import { SupportModule } from './support/support.module';
import { MediaModule } from './media/media.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { AuthentificationModule } from './auth/authentification.module';
import { StripeModule } from './stripe/stripe.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailModule } from './mail/mail.module';
import { MinioModule } from './minio/minio.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SearchModule } from './search/search.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MinioModule,
    MailModule,
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
    StripeModule,
    StatisticsModule,
    SearchModule,
    VideoModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 8,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 25,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 150,
      },
    ]),
  ],
})
export class AppModule { }
