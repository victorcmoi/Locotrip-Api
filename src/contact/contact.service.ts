import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(private readonly mailService: MailService) {}

  async sendContactForm(name: string, email: string, subject: string, message: string) {
    return this.mailService.sendContactEmail(name, email, subject, message);
  }
}
