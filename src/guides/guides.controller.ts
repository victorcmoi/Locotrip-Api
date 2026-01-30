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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { GuidesService } from './guides.service';
import { GuideDocumentsService } from './guide-documents.service';
import { BoostOffersService } from './boost-offers.service';
import { GuideBoostsService } from './guide-boosts.service';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { SoftDeleteGuideDto } from './dto/soft-delete-guide.dto';
import { CreateGuideDocumentDto } from './dto/create-guide-document.dto';
import { UpdateGuideDocumentDto } from './dto/update-guide-document.dto';
import { CreateGuideBoostDto } from './dto/create-guide-boost.dto';
import { CreateBoostOfferDto } from './dto/create-boost-offer.dto';
import { UpdateBoostOfferDto } from './dto/update-boost-offer.dto';
import { FindAllGuidesDto } from './dto/find-all-guides.dto';
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
    private readonly boostOffersService: BoostOffersService,
    private readonly guideBoostsService: GuideBoostsService,
  ) { }

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
  findAll(@Query() query: FindAllGuidesDto) {
    return this.guidesService.findAll(query);
  }

  @Get('top-rated')
  @Public()
  @ApiOperation({
    summary: 'Récupérer les guides les mieux notés',
    description:
      "Retourne les guides avec les meilleures notes pondérées par le nombre d'avis",
  })
  @ApiGetManyResponse(GuideEntity)
  findTopRated(
    @Query('limit') limit?: number,
    @Query('minReviews') minReviews?: number,
  ) {
    return this.guidesService.findTopRated(
      limit ? Number(limit) : 5,
      minReviews ? Number(minReviews) : 1,
    );
  }


  @Get('local')
  @ApiOperation({
    summary:
      'Récupérer les guides locaux avec demande de carte - Admin uniquement',
  })
  @ApiGetManyResponse(GuideEntity)
  findLocalWithCardRequests() {
    return this.guidesService.findLocalWithCardRequests();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer un guide par son ID' })
  @ApiParam({ name: 'id', description: 'ID du GUIDE' })
  @ApiGetOneResponse(GuideEntity)
  findOne(@Param('id') id: string) {
    return this.guidesService.findOne(id);
  }

  @Patch(':id/update-response-time')
  @Roles(UserRole.ADMIN, UserRole.GUIDE)
  @ApiOperation({ summary: 'Recalculer et mettre à jour le délai de réponse du guide' })
  @ApiParam({ name: 'id', description: 'ID du guide' })
  @ApiUpdateResponse(Object)
  async updateResponseTime(@Param('id') id: string) {
    const responseTime = await this.guidesService.calculateAverageResponseTime(id);

    if (responseTime !== null) {
      await this.guidesService.update(id, {
        response_time_hours: responseTime
      });

      const responseTimeRange = this.guidesService.getResponseTimeRange(responseTime);

      return {
        message: 'Délai de réponse mis à jour avec succès',
        response_time_hours: responseTime,
        response_time_range: responseTimeRange,
      };
    }

    return {
      message: 'Pas assez de données pour calculer le délai de réponse',
      response_time_hours: null,
      response_time_range: null,
    };
  }

  @Get('user/:userId')
  @Public()
  @ApiOperation({ summary: 'Récupérer le guide associé à un utilisateur' })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiGetOneResponse(GuideEntity)
  findByUser(@Param('userId') userId: string) {
    return this.guidesService.findByUser(userId);
  }

  @Put(':id')
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
  softDelete(
    @Param('id') id: string,
    @Body() softDeleteDto: SoftDeleteGuideDto,
  ) {
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
  @ApiOperation({
    summary:
      'Récupérer tous les guides (actifs et inactifs) - Admin uniquement',
  })
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
  @ApiOperation({ summary: "Récupérer les documents d'un guide" })
  @ApiParam({ name: 'guideId', description: 'ID du guide' })
  @ApiGetManyResponse(Object)
  findDocumentsByGuide(@Param('guideId') guideId: string) {
    return this.guideDocumentsService.findByGuide(guideId);
  }

  @Patch(':guideId/documents/:documentId')
  @ApiOperation({ summary: 'Mettre à jour un document de guide' })
  @ApiParam({ name: 'documentId', description: 'ID du document' })
  @ApiUpdateResponse(Object)
  updateDocument(
    @Param('documentId') documentId: string,
    @Body() updateDocumentDto: UpdateGuideDocumentDto,
  ) {
    return this.guideDocumentsService.update(documentId, {
      ...updateDocumentDto,
      verification_date: updateDocumentDto.verification_status ? new Date() : undefined,
    });
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
  @ApiOperation({ summary: "Récupérer les boosts d'un guide" })
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
  constructor(private readonly boostOffersService: BoostOffersService) { }

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
  @ApiParam({ name: 'id', description: "ID de l'offre" })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.boostOffersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une offre de boost' })
  @ApiParam({ name: 'id', description: "ID de l'offre" })
  @ApiUpdateResponse(Object)
  update(
    @Param('id') id: string,
    @Body() updateBoostOfferDto: UpdateBoostOfferDto,
  ) {
    return this.boostOffersService.update(id, updateBoostOfferDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une offre de boost' })
  @ApiParam({ name: 'id', description: "ID de l'offre" })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.boostOffersService.delete(id);
  }
}
