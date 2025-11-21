import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailgunModule } from 'nestjs-mailgun';

@Global()
@Module({
  imports: [
    MailgunModule.forRoot({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || '',
      url: process.env.MAILGUN_BASE_URL || 'https://api.eu.mailgun.net',
      public_key: process.env.MAILGUN_PUBLIC_KEY || '',
    }),
  ],
  providers: [MailService],
  exports: [MailService, MailgunModule],
})
export class MailModule {}
