import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { GuidesService } from './guides.service';
import { GuideDocumentsService } from './guide-documents.service';
import { GuideAvailabilityService } from './guide-availability.service';
import { BoostOffersService } from './boost-offers.service';
import { GuideBoostsService } from './guide-boosts.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { SoftDeleteGuideDto } from './dto/soft-delete-guide.dto';
import { CreateGuideDocumentDto } from './dto/create-guide-document.dto';
import { CreateGuideAvailabilityDto } from './dto/create-guide-availability.dto';
import { CreateGuideBoostDto } from './dto/create-guide-boost.dto';
import { CreateBoostOfferDto } from './dto/create-boost-offer.dto';
import { UpdateBoostOfferDto } from './dto/update-boost-offer.dto';
import { GuideEntity } from './entities/guide.entity';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '../users/enums/user.enum';
import { Public } from '../common/decorators/authentification-decorator';

@ApiTags('Guides')
@ApiBearerAuth('JWT-auth')
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
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouveau profil guide' })
  @ApiCreateResponse(GuideEntity)
  create(@Body() createGuideDto: CreateGuideDto) {
    return this.guidesService.create(createGuideDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Récupérer tous les guides' })
  @ApiGetManyResponse(GuideEntity)
  findAll() {
    return this.guidesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer un guide par son ID' })
  @ApiParam({ name: 'id', description: 'ID du GUIDE' })
  @ApiGetOneResponse(GuideEntity)
  findOne(@Param('id') id: string) {
    return this.guidesService.findOne(id);
  }

  @Get('user/:userId')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer le guide associé à un utilisateur' })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  @ApiGetOneResponse(GuideEntity)
  findByUser(@Param('userId') userId: string) {
    return this.guidesService.findByUser(userId);
  }

  @Put(':id')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Mettre à jour un guide' })
  @ApiParam({ name: 'id', description: 'ID du guide' })
  @ApiUpdateResponse(GuideEntity)
  update(@Param('id') id: string, @Body() updateGuideDto: UpdateGuideDto) {
    return this.guidesService.update(id, updateGuideDto);
  }

  @Delete(':id')
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un guide' })
  @ApiParam({ name: 'id', description: 'ID du guide' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.guidesService.delete(id);
  }

  @Delete(':id/soft')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Suspendre un guide (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID du guide (UUID)' })
  @ApiBody({ type: SoftDeleteGuideDto })
  @ApiUpdateResponse(GuideEntity)
  softDelete(@Param('id') id: string, @Body() softDeleteDto: SoftDeleteGuideDto) {
    return this.guidesService.softDelete(id, softDeleteDto.reason);
  }

  @Patch(':id/restore')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Réactiver un guide suspendu' })
  @ApiParam({ name: 'id', description: 'ID du guide (UUID)' })
  @ApiUpdateResponse(GuideEntity)
  restore(@Param('id') id: string) {
    return this.guidesService.restore(id);
  }

  @Get('all/including-deleted')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Récupérer tous les guides (actifs et inactifs) - Admin uniquement' })
  @ApiGetManyResponse(GuideEntity)
  findAllIncludingDeleted() {
    return this.guidesService.findAllIncludingDeleted();
  }

  // === DOCUMENTS ===
  @Post(':guideId/documents')
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un document au guide' })
  @ApiParam({ name: 'guideId', description: 'ID du guide' })
  @ApiCreateResponse(Object)
  createDocument(@Body() createDocumentDto: CreateGuideDocumentDto) {
    return this.guideDocumentsService.create(createDocumentDto);
  }

  @Get(':guideId/documents')
  @Public()
  @ApiOperation({ summary: 'Récupérer les documents d\'un guide' })
  @ApiParam({ name: 'guideId', description: 'ID du guide' })
  @ApiGetManyResponse(Object)
  findDocumentsByGuide(@Param('guideId') guideId: string) {
    return this.guideDocumentsService.findByGuide(guideId);
  }

  // === DISPONIBILITÉS ===
  @Post(':guideId/availability')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter une disponibilité' })
  @ApiParam({ name: 'guideId', description: 'ID du guide' })
  @ApiCreateResponse(Object)
  createAvailability(@Body() createAvailabilityDto: CreateGuideAvailabilityDto) {
    return this.guideAvailabilityService.create(createAvailabilityDto);
  }

  @Get(':guideId/availability')
  @Public()
  @ApiOperation({ summary: 'Récupérer les disponibilités d\'un guide' })
  @ApiParam({ name: 'guideId', description: 'ID du guide' })
  @ApiGetManyResponse(Object)
  findAvailabilityByGuide(@Param('guideId') guideId: string) {
    return this.guideAvailabilityService.findByGuide(guideId);
  }

  // === BOOSTS ===
  @Post(':guideId/boosts')
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Activer un boost pour un guide' })
  @ApiParam({ name: 'guideId', description: 'ID du guide' })
  @ApiCreateResponse(Object)
  createBoost(@Body() createBoostDto: CreateGuideBoostDto) {
    return this.guideBoostsService.create(createBoostDto);
  }

  @Get(':guideId/boosts')
  @Roles(UserRole.GUIDE, UserRole.CLIENT)
  @ApiOperation({ summary: 'Récupérer les boosts d\'un guide' })
  @ApiParam({ name: 'guideId', description: 'ID du guide' })
  @ApiGetManyResponse(Object)
  findBoostsByGuide(@Param('guideId') guideId: string) {
    return this.guideBoostsService.findByGuide(guideId);
  }
}

@ApiTags('Offres de Boost')
@ApiBearerAuth('JWT-auth')
@Controller('boost-offers')
export class BoostOffersController {
  constructor(private readonly boostOffersService: BoostOffersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une offre de boost' })
  @ApiCreateResponse(Object)
  create(@Body() createBoostOfferDto: CreateBoostOfferDto) {
    return this.boostOffersService.create(createBoostOfferDto);
  }

  @Get()
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer toutes les offres de boost' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.boostOffersService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer une offre de boost' })
  @ApiParam({ name: 'id', description: 'ID de l\'offre' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.boostOffersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une offre de boost' })
  @ApiParam({ name: 'id', description: 'ID de l\'offre' })
  @ApiUpdateResponse(Object)
  update(@Param('id') id: string, @Body() updateBoostOfferDto: UpdateBoostOfferDto) {
    return this.boostOffersService.update(id, updateBoostOfferDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une offre de boost' })
  @ApiParam({ name: 'id', description: 'ID de l\'offre' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.boostOffersService.delete(id);
  }
}
