import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';
import { UserRole } from '../users/enums/user.enum';
import { Roles } from '../common/decorators/role.decorator';

@ApiTags('Messagerie')
@ApiBearerAuth('JWT-auth')
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une conversation' })
  @ApiCreateResponse(Object)
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationsService.create(createConversationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les conversations' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.conversationsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer une conversation' })
  @ApiParam({ name: 'id', description: 'ID de la conversation' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.conversationsService.findOne(id);
  }

  @Get('booking/:bookingId')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: "Récupérer la conversation d'une réservation" })
  @ApiParam({ name: 'bookingId', description: 'ID de la réservation' })
  @ApiGetOneResponse(Object)
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.conversationsService.findByBooking(bookingId);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une conversation' })
  @ApiParam({ name: 'id', description: 'ID de la conversation' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.conversationsService.delete(id);
  }

  // Messages
  @Post(':conversationId/messages')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Envoyer un message' })
  @ApiParam({ name: 'conversationId', description: 'ID de la conversation' })
  @ApiCreateResponse(Object)
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get(':conversationId/messages')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: "Récupérer les messages d'une conversation" })
  @ApiParam({ name: 'conversationId', description: 'ID de la conversation' })
  @ApiGetManyResponse(Object)
  findMessagesByConversation(@Param('conversationId') conversationId: string) {
    return this.messagesService.findByConversation(conversationId);
  }
}

@ApiTags('Messages')
@ApiBearerAuth('JWT-auth')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les messages' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer un message' })
  @ApiParam({ name: 'id', description: 'ID du message' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un message' })
  @ApiParam({ name: 'id', description: 'ID du message' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.messagesService.delete(id);
  }
}
