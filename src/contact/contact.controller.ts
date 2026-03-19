import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Public } from '../common/decorators/authentification-decorator';

@Public()
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async sendContactForm(
    @Body() body: { name: string; email: string; subject: string; message: string },
  ) {
    const { name, email, subject, message } = body;
    return this.contactService.sendContactForm(name, email, subject, message);
  }
}
