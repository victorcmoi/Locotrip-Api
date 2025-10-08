import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';
import { Prisma } from '@prisma/client';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.conversationCreateInput) {
    return this.conversationsService.create(data);
  }

  @Get()
  findAll() {
    return this.conversationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }

  @Get('reservation/:reservationId')
  findByReservation(@Param('reservationId') reservationId: string) {
    return this.conversationsService.findByReservation(reservationId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.conversationsService.delete(id);
  }

  // Messages
  @Post(':conversationId/messages')
  @HttpCode(HttpStatus.CREATED)
  createMessage(@Body() data: Prisma.messageCreateInput) {
    return this.messagesService.create(data);
  }

  @Get(':conversationId/messages')
  findMessagesByConversation(@Param('conversationId') conversationId: string) {
    return this.messagesService.findByConversation(conversationId);
  }
}

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.messagesService.delete(id);
  }
}
