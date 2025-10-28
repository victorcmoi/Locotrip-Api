import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailgunModule } from 'nestjs-mailgun';

@Global()
@Module({
  imports: [
    MailgunModule.forRoot({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || process.env.MAILGUN_API_KEY_SANDBOX || '',
      url: process.env.MAILGUN_BASE_URL || process.env.MAILGUN_BASE_URL_SANDBOX || 'https://api.eu.mailgun.net',
      public_key: process.env.MAILGUN_PUBLIC_KEY ?? '',
    }),
  ],
  providers: [MailService],
  exports: [MailService, MailgunModule],
})
export class MailModule {}
