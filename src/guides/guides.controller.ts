import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { GuidesService } from './guides.service';
import { GuideDocumentsService } from './guide-documents.service';
import { GuideAvailabilityService } from './guide-availability.service';
import { BoostOffersService } from './boost-offers.service';
import { GuideBoostsService } from './guide-boosts.service';
import { Prisma } from '@prisma/client';

@Controller('guides')
export class GuidesController {
  constructor(
    private readonly guidesService: GuidesService,
    private readonly guideDocumentsService: GuideDocumentsService,
    private readonly guideAvailabilityService: GuideAvailabilityService,
    private readonly boostOffersService: BoostOffersService,
    private readonly guideBoostsService: GuideBoostsService,
  ) {}

  // === GUIDES ===
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.guideCreateInput) {
    return this.guidesService.create(data);
  }

  @Get()
  findAll() {
    return this.guidesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guidesService.findOne(id);
  }

  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.guidesService.findByUtilisateur(utilisateurId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.guideUpdateInput) {
    return this.guidesService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.guidesService.delete(id);
  }

  // === DOCUMENTS ===
  @Post(':guideId/documents')
  @HttpCode(HttpStatus.CREATED)
  createDocument(@Body() data: Prisma.guide_documentCreateInput) {
    return this.guideDocumentsService.create(data);
  }

  @Get(':guideId/documents')
  findDocumentsByGuide(@Param('guideId') guideId: string) {
    return this.guideDocumentsService.findByGuide(guideId);
  }

  // === DISPONIBILITÉS ===
  @Post(':guideId/availability')
  @HttpCode(HttpStatus.CREATED)
  createAvailability(@Body() data: Prisma.guide_availabilityCreateInput) {
    return this.guideAvailabilityService.create(data);
  }

  @Get(':guideId/availability')
  findAvailabilityByGuide(@Param('guideId') guideId: string) {
    return this.guideAvailabilityService.findByGuide(guideId);
  }

  // === BOOSTS ===
  @Post(':guideId/boosts')
  @HttpCode(HttpStatus.CREATED)
  createBoost(@Body() data: Prisma.guide_boostCreateInput) {
    return this.guideBoostsService.create(data);
  }

  @Get(':guideId/boosts')
  findBoostsByGuide(@Param('guideId') guideId: string) {
    return this.guideBoostsService.findByGuide(guideId);
  }
}

@Controller('boost-offers')
export class BoostOffersController {
  constructor(private readonly boostOffersService: BoostOffersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.boost_offerCreateInput) {
    return this.boostOffersService.create(data);
  }

  @Get()
  findAll() {
    return this.boostOffersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boostOffersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.boost_offerUpdateInput) {
    return this.boostOffersService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.boostOffersService.delete(id);
  }
}
