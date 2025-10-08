import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { PaiementsService } from './paiements.service';
import { LitigesService } from './litiges.service';
import { Prisma } from '@prisma/client';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly paiementsService: PaiementsService,
    private readonly litigesService: LitigesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.reservationCreateInput) {
    return this.reservationsService.create(data);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.reservationsService.findByUtilisateur(utilisateurId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.reservationUpdateInput) {
    return this.reservationsService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.reservationsService.delete(id);
  }

  // Paiements
  @Post(':reservationId/paiements')
  @HttpCode(HttpStatus.CREATED)
  createPaiement(@Body() data: Prisma.paiementCreateInput) {
    return this.paiementsService.create(data);
  }

  @Get(':reservationId/paiements')
  findPaiementsByReservation(@Param('reservationId') reservationId: string) {
    return this.paiementsService.findByReservation(reservationId);
  }

  // Litiges
  @Post(':reservationId/litiges')
  @HttpCode(HttpStatus.CREATED)
  createLitige(@Body() data: Prisma.litigeCreateInput) {
    return this.litigesService.create(data);
  }
}

@Controller('paiements')
export class PaiementsController {
  constructor(private readonly paiementsService: PaiementsService) {}

  @Get()
  findAll() {
    return this.paiementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paiementsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.paiementUpdateInput) {
    return this.paiementsService.update(id, data);
  }
}

@Controller('litiges')
export class LitigesController {
  constructor(private readonly litigesService: LitigesService) {}

  @Get()
  findAll() {
    return this.litigesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.litigesService.findOne(id);
  }

  @Get('statut/:statut')
  findByStatut(@Param('statut') statut: string) {
    return this.litigesService.findByStatut(statut);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.litigeUpdateInput) {
    return this.litigesService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.litigesService.delete(id);
  }
}
