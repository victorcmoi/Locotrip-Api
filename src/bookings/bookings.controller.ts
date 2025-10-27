import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { PaymentsService } from './payments.service';
import { DisputesService } from './disputes.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { BookingEntity } from './entities/booking.entity';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';
import { DisputeStatus } from '@prisma/client';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '../users/enums/user.enum';

@ApiTags('Réservations')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly paymentsService: PaymentsService,
    private readonly DisputesService: DisputesService,
  ) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiCreateResponse(BookingEntity)
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Récupérer toutes les réservations' })
  @ApiGetManyResponse(BookingEntity)
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Récupérer une réservation' })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiGetOneResponse(BookingEntity)
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Récupérer les réservations d\'un utilisateur' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiGetManyResponse(BookingEntity)
  findByUser(@Param('userId') userId: string) {
    return this.bookingsService.findByUser(userId);
  }

  @Put(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Mettre à jour une réservation' })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiUpdateResponse(BookingEntity)
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une réservation' })
  @ApiParam({ name: 'id', description: 'ID de la réservation' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.bookingsService.delete(id);
  }

  // Paiements
  @Post(':bookingId/payments')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un payment' })
  @ApiParam({ name: 'bookingId', description: 'ID de la réservation' })
  createPaiement(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get(':bookingId/payments')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Récupérer les payments d\'une réservation' })
  @ApiParam({ name: 'bookingId', description: 'ID de la réservation' })
  findPaiementsByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentsService.findByBooking(bookingId);
  }

  // Disputes
  @Post(':bookingId/disputes')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un litige' })
  @ApiParam({ name: 'bookingId', description: 'ID de la réservation' })
  createDispute(@Body() createDisputeDto: CreateDisputeDto) {
    return this.DisputesService.create(createDisputeDto);
  }
}

@ApiTags('Paiements')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
export class PaiementsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les paiements' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Récupérer un paiement' })
  @ApiParam({ name: 'id', description: 'ID du paiement' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un paiement' })
  @ApiParam({ name: 'id', description: 'ID du paiement' })
  @ApiUpdateResponse(Object)
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }
}

@ApiTags('Litiges')
@ApiBearerAuth('JWT-auth')
@Controller('disputes')
export class DisputesController {
  constructor(private readonly DisputesService: DisputesService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les litiges' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.DisputesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Récupérer un litige' })
  @ApiParam({ name: 'id', description: 'ID du dispute' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.DisputesService.findOne(id);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Récupérer les litiges par statut' })
  @ApiParam({ name: 'status', description: 'Statut du litige' })
  @ApiGetManyResponse(Object)
  findByStatut(@Param('status') status: DisputeStatus) {
    return this.DisputesService.findByStatut(status);
  }

  @Put(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Mettre à jour un litige' })
  @ApiParam({ name: 'id', description: 'ID du litige' })
  @ApiUpdateResponse(Object)
  update(@Param('id') id: string, @Body() updateDisputeDto: UpdateDisputeDto) {
    return this.DisputesService.update(id, updateDisputeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un litige' })
  @ApiParam({ name: 'id', description: 'ID du litige' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.DisputesService.delete(id);
  }
}
