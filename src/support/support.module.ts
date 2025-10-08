import { Module } from '@nestjs/common';
import { SupportTicketsController, NotificationsController } from './support.controller';
import { SupportTicketsService } from './support-tickets.service';
import { TicketMessagesService } from './ticket-messages.service';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SupportTicketsController, NotificationsController],
  providers: [
    SupportTicketsService,
    TicketMessagesService,
    NotificationsService,
    PrismaService,
  ],
  exports: [
    SupportTicketsService,
    TicketMessagesService,
    NotificationsService,
  ],
})
export class SupportModule {}
