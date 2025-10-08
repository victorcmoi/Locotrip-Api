import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';
import { TicketMessagesService } from './ticket-messages.service';
import { NotificationsService } from './notifications.service';
import { Prisma } from '@prisma/client';

@Controller('support-tickets')
export class SupportTicketsController {
  constructor(
    private readonly supportTicketsService: SupportTicketsService,
    private readonly ticketMessagesService: TicketMessagesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.support_ticketCreateInput) {
    return this.supportTicketsService.create(data);
  }

  @Get()
  findAll() {
    return this.supportTicketsService.findAll();
  }

  @Get('statut/:statut')
  findByStatut(@Param('statut') statut: string) {
    return this.supportTicketsService.findByStatut(statut);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportTicketsService.findOne(id);
  }

  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.supportTicketsService.findByUtilisateur(utilisateurId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.support_ticketUpdateInput) {
    return this.supportTicketsService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.supportTicketsService.delete(id);
  }

  // Messages
  @Post(':ticketId/messages')
  @HttpCode(HttpStatus.CREATED)
  createMessage(@Body() data: Prisma.ticket_messageCreateInput) {
    return this.ticketMessagesService.create(data);
  }

  @Get(':ticketId/messages')
  findMessagesByTicket(@Param('ticketId') ticketId: string) {
    return this.ticketMessagesService.findByTicket(ticketId);
  }
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.notificationCreateInput) {
    return this.notificationsService.create(data);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.notificationsService.findByUtilisateur(utilisateurId);
  }

  @Get('utilisateur/:utilisateurId/non-lues')
  findNonLues(@Param('utilisateurId') utilisateurId: string) {
    return this.notificationsService.findNonLues(utilisateurId);
  }

  @Patch(':id/marquer-lue')
  marquerCommeLue(@Param('id') id: string) {
    return this.notificationsService.marquerCommeLue(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.notificationUpdateInput) {
    return this.notificationsService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }
}
