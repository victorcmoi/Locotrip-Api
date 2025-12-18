import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SupportTicketsService } from './support-tickets.service';
import { TicketMessagesService } from './ticket-messages.service';
import { NotificationsService } from './notifications.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';
import { SupportTicketStatus } from './enums/ticket-message.enum';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '../users/enums/user.enum';

@ApiTags('Support')
@ApiBearerAuth('JWT-auth')
@Controller('support-tickets')
export class SupportTicketsController {
  constructor(
    private readonly supportTicketsService: SupportTicketsService,
    private readonly ticketMessagesService: TicketMessagesService,
  ) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un ticket de support' })
  @ApiCreateResponse(Object)
  create(@Body() createSupportTicketDto: CreateSupportTicketDto) {
    return this.supportTicketsService.create(createSupportTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les tickets' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.supportTicketsService.findAll();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Récupérer les tickets par statut' })
  @ApiParam({
    name: 'status',
    description: 'Statut du ticket (open, in_progress, closed)',
  })
  @ApiGetManyResponse(Object)
  findByStatut(@Param('status') status: SupportTicketStatus) {
    return this.supportTicketsService.findByStatut(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un ticket' })
  @ApiParam({ name: 'id', description: 'ID du ticket' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.supportTicketsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Récupérer les tickets d'un utilisateur" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiGetManyResponse(Object)
  findByUser(@Param('userId') userId: string) {
    return this.supportTicketsService.findByUser(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un ticket' })
  @ApiParam({ name: 'id', description: 'ID du ticket' })
  @ApiUpdateResponse(Object)
  update(
    @Param('id') id: string,
    @Body() data: Partial<CreateSupportTicketDto>,
  ) {
    return this.supportTicketsService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un ticket' })
  @ApiParam({ name: 'id', description: 'ID du ticket' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.supportTicketsService.delete(id);
  }

  // Messages
  @Post(':ticketId/messages')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un message au ticket' })
  @ApiParam({ name: 'ticketId', description: 'ID du ticket' })
  @ApiCreateResponse(Object)
  createMessage(@Body() createTicketMessageDto: CreateTicketMessageDto) {
    return this.ticketMessagesService.create(createTicketMessageDto);
  }

  @Get(':ticketId/messages')
  @ApiOperation({ summary: "Récupérer les messages d'un ticket" })
  @ApiParam({ name: 'ticketId', description: 'ID du ticket' })
  @ApiGetManyResponse(Object)
  findMessagesByTicket(@Param('ticketId') ticketId: string) {
    return this.ticketMessagesService.findByTicket(ticketId);
  }
}

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une notification' })
  @ApiCreateResponse(Object)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer toutes les notifications' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer une notification' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Get('user/:userId')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: "Récupérer les notifications d'un utilisateur" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiGetManyResponse(Object)
  findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Get('user/:userId/non-lues')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer les notifications non lues' })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiGetManyResponse(Object)
  findNonLues(@Param('userId') userId: string) {
    return this.notificationsService.findNonLues(userId);
  }

  @Patch(':id/marquer-lue')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  @ApiUpdateResponse(Object)
  marquerCommeLue(@Param('id') id: string) {
    return this.notificationsService.marquerCommeLue(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une notification' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  @ApiUpdateResponse(Object)
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une notification' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }
}
