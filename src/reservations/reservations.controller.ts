import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { PaiementsService } from './paiements.service';
import { LitigesService } from './litiges.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';
import { CreateLitigeDto } from './dto/create-litige.dto';
import { UpdateLitigeDto } from './dto/update-litige.dto';
import { ReservationEntity } from './entities/reservation.entity';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';
import { StatutLitige } from '@prisma/client';

@ApiTags('Réservations')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly paiementsService: PaiementsService,
    private readonly litigesService: LitigesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiCreateResponse(ReservationEntity)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les réservations' })
  @ApiGetManyResponse(ReservationEntity)
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une réservation' })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiGetOneResponse(ReservationEntity)
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Get('utilisateur/:utilisateurId')
  @ApiOperation({ summary: 'Récupérer les réservations d\'un utilisateur' })
  @ApiParam({ name: 'utilisateurId', description: 'ID de l\'utilisateur' })
  @ApiGetManyResponse(ReservationEntity)
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.reservationsService.findByUtilisateur(utilisateurId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une réservation' })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiUpdateResponse(ReservationEntity)
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une réservation' })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.reservationsService.delete(id);
  }

  // Paiements
  @Post(':reservationId/paiements')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un paiement' })
  @ApiParam({ name: 'reservationId', description: 'ID de la réservation' })
  createPaiement(@Body() createPaiementDto: CreatePaiementDto) {
    return this.paiementsService.create(createPaiementDto);
  }

  @Get(':reservationId/paiements')
  @ApiOperation({ summary: 'Récupérer les paiements d\'une réservation' })
  @ApiParam({ name: 'reservationId', description: 'ID de la réservation' })
  findPaiementsByReservation(@Param('reservationId') reservationId: string) {
    return this.paiementsService.findByReservation(reservationId);
  }

  // Litiges
  @Post(':reservationId/litiges')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un litige' })
  @ApiParam({ name: 'reservationId', description: 'ID de la réservation' })
  createLitige(@Body() createLitigeDto: CreateLitigeDto) {
    return this.litigesService.create(createLitigeDto);
  }
}

@ApiTags('Paiements')
@Controller('paiements')
export class PaiementsController {
  constructor(private readonly paiementsService: PaiementsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les paiements' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.paiementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un paiement' })
  @ApiParam({ name: 'id', description: 'ID du paiement' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.paiementsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un paiement' })
  @ApiParam({ name: 'id', description: 'ID du paiement' })
  @ApiUpdateResponse(Object)
  update(@Param('id') id: string, @Body() updatePaiementDto: UpdatePaiementDto) {
    return this.paiementsService.update(id, updatePaiementDto);
  }
}

@ApiTags('Litiges')
@Controller('litiges')
export class LitigesController {
  constructor(private readonly litigesService: LitigesService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les litiges' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.litigesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un litige' })
  @ApiParam({ name: 'id', description: 'ID du litige' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.litigesService.findOne(id);
  }

  @Get('statut/:statut')
  @ApiOperation({ summary: 'Récupérer les litiges par statut' })
  @ApiParam({ name: 'statut', description: 'Statut du litige' })
  @ApiGetManyResponse(Object)
  findByStatut(@Param('statut') statut: StatutLitige) {
    return this.litigesService.findByStatut(statut);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un litige' })
  @ApiParam({ name: 'id', description: 'ID du litige' })
  @ApiUpdateResponse(Object)
  update(@Param('id') id: string, @Body() updateLitigeDto: UpdateLitigeDto) {
    return this.litigesService.update(id, updateLitigeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un litige' })
  @ApiParam({ name: 'id', description: 'ID du litige' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.litigesService.delete(id);
  }
}
