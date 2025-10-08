import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
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

@ApiTags('Support')
@Controller('support-tickets')
export class SupportTicketsController {
  constructor(
    private readonly supportTicketsService: SupportTicketsService,
    private readonly ticketMessagesService: TicketMessagesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un ticket de support' })
  create(@Body() createSupportTicketDto: CreateSupportTicketDto) {
    return this.supportTicketsService.create(createSupportTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les tickets' })
  findAll() {
    return this.supportTicketsService.findAll();
  }

  @Get('statut/:statut')
  @ApiOperation({ summary: 'Récupérer les tickets par statut' })
  @ApiParam({ name: 'statut', description: 'Statut du ticket (ouvert, en_cours, fermé)' })
  findByStatut(@Param('statut') statut: string) {
    return this.supportTicketsService.findByStatut(statut);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un ticket' })
  @ApiParam({ name: 'id', description: 'ID du ticket' })
  findOne(@Param('id') id: string) {
    return this.supportTicketsService.findOne(id);
  }

  @Get('utilisateur/:utilisateurId')
  @ApiOperation({ summary: 'Récupérer les tickets d\'un utilisateur' })
  @ApiParam({ name: 'utilisateurId', description: 'ID de l\'utilisateur' })
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.supportTicketsService.findByUtilisateur(utilisateurId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un ticket' })
  @ApiParam({ name: 'id', description: 'ID du ticket' })
  update(@Param('id') id: string, @Body() data: any) {
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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un message au ticket' })
  @ApiParam({ name: 'ticketId', description: 'ID du ticket' })
  createMessage(@Body() createTicketMessageDto: CreateTicketMessageDto) {
    return this.ticketMessagesService.create(createTicketMessageDto);
  }

  @Get(':ticketId/messages')
  @ApiOperation({ summary: 'Récupérer les messages d\'un ticket' })
  @ApiParam({ name: 'ticketId', description: 'ID du ticket' })
  findMessagesByTicket(@Param('ticketId') ticketId: string) {
    return this.ticketMessagesService.findByTicket(ticketId);
  }
}

@ApiTags('Notifications')
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
  @ApiOperation({ summary: 'Récupérer toutes les notifications' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une notification' })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Get('utilisateur/:utilisateurId')
  @ApiOperation({ summary: 'Récupérer les notifications d\'un utilisateur' })
  @ApiParam({ name: 'utilisateurId', description: 'ID de l\'utilisateur' })
  @ApiGetManyResponse(Object)
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.notificationsService.findByUtilisateur(utilisateurId);
  }

  @Get('utilisateur/:utilisateurId/non-lues')
  @ApiOperation({ summary: 'Récupérer les notifications non lues' })
  @ApiParam({ name: 'utilisateurId', description: 'ID de l\'utilisateur' })
  @ApiGetManyResponse(Object)
  findNonLues(@Param('utilisateurId') utilisateurId: string) {
    return this.notificationsService.findNonLues(utilisateurId);
  }

  @Patch(':id/marquer-lue')
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
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
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
