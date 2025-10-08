import { Module } from '@nestjs/common';
import { ConversationsController, MessagesController } from './messagerie.controller';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ConversationsController, MessagesController],
  providers: [ConversationsService, MessagesService, PrismaService],
  exports: [ConversationsService, MessagesService],
})
export class MessagerieModule {}
