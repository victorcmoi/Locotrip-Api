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
} from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { ExperiencesService } from './experiences.service';
import { CategoriesService } from './categories.service';
import { ExperienceAvailabilityService } from './experience-availability.service';
import { ExperienceCategoriesService } from './experience-categories.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateExperienceAvailabilityDto } from './dto/create-experience-availability.dto';
import { FindAllCitiesDto } from './dto/find-all-cities.dto';
import { FindAllExperiencesDto } from './dto/find-all-experiences.dto';
import { ExperienceEntity } from './entities/experience.entity';
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

@ApiTags('Villes')
@ApiBearerAuth('JWT-auth')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une ville' })
  @ApiCreateResponse(Object)
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Récupérer toutes les villes' })
  @ApiGetManyResponse(Object)
  findAll(@Query() query: FindAllCitiesDto) {
    return this.citiesService.findAll(query);
  }

  @Get('suggested')
  @Public()
  @ApiOperation({ summary: 'Récupérer les villes suggérées' })
  @ApiGetManyResponse(Object)
  findSuggested() {
    return this.citiesService.findSuggested();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer une ville' })
  @ApiParam({ name: 'id', description: 'ID de la ville' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une ville' })
  @ApiParam({ name: 'id', description: 'ID de la ville' })
  @ApiUpdateResponse(Object)
  update(@Param('id') id: string, @Body() updateVilleDto: UpdateCityDto) {
    return this.citiesService.update(id, updateVilleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une ville' })
  @ApiParam({ name: 'id', description: 'ID de la ville' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.citiesService.delete(id);
  }
}

@ApiTags('Expériences')
@ApiBearerAuth('JWT-auth')
@Controller('experiences')
export class ExperiencesController {
  constructor(
    private readonly experiencesService: ExperiencesService,
    private readonly experienceAvailabilityService: ExperienceAvailabilityService,
    private readonly experienceCategoriesService: ExperienceCategoriesService,
  ) { }

  @Post()
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une expérience' })
  @ApiCreateResponse(ExperienceEntity)
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experiencesService.create(createExperienceDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Récupérer toutes les expériences' })
  @ApiGetManyResponse(ExperienceEntity)
  findAll(@Query() query: FindAllExperiencesDto) {
    return this.experiencesService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer une expérience' })
  @ApiParam({ name: 'id', description: "ID de l'expérience" })
  @ApiGetOneResponse(ExperienceEntity)
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Get(':id/guide/:guideId')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: "Récupérer une expérience en tant que guide (y compris brouillons)" })
  @ApiParam({ name: 'id', description: "ID de l'expérience" })
  @ApiParam({ name: 'guideId', description: "ID du guide" })
  @ApiGetOneResponse(ExperienceEntity)
  findOneForGuide(
    @Param('id') id: string,
    @Param('guideId') guideId: string,
  ) {
    return this.experiencesService.findOneForGuide(id, guideId);
  }

  @Get('city/:cityId')
  @Public()
  @ApiOperation({ summary: "Récupérer les expériences d'une ville" })
  @ApiParam({ name: 'cityId', description: 'ID de la ville' })
  @ApiGetManyResponse(ExperienceEntity)
  findByVille(@Param('cityId') cityId: string) {
    return this.experiencesService.findByVille(cityId);
  }

  @Get('guide/:guideId')
  @Public()
  @ApiOperation({ summary: "Récupérer les expériences d'un guide" })
  @ApiParam({ name: 'guideId', description: 'ID du guide' })
  @ApiGetManyResponse(ExperienceEntity)
  findByGuide(@Param('guideId') guideId: string) {
    return this.experiencesService.findByGuide(guideId);
  }

  @Put(':id')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Mettre à jour une expérience' })
  @ApiParam({ name: 'id', description: "ID de l'expérience" })
  @ApiUpdateResponse(ExperienceEntity)
  update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une expérience' })
  @ApiParam({ name: 'id', description: "ID de l'expérience" })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.experiencesService.delete(id);
  }

  @Delete(':id/soft')
  @Roles(UserRole.GUIDE, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Désactiver une expérience (soft delete)' })
  @ApiParam({ name: 'id', description: "ID de l'expérience (UUID)" })
  @ApiUpdateResponse(ExperienceEntity)
  softDelete(@Param('id') id: string) {
    return this.experiencesService.softDelete(id);
  }

  @Patch(':id/restore')
  @Roles(UserRole.GUIDE, UserRole.ADMIN)
  @ApiOperation({ summary: 'Réactiver une expérience désactivée' })
  @ApiParam({ name: 'id', description: "ID de l'expérience (UUID)" })
  @ApiUpdateResponse(ExperienceEntity)
  restore(@Param('id') id: string) {
    return this.experiencesService.restore(id);
  }

  @Patch(':id/publish')
  @Roles(UserRole.GUIDE)
  @ApiOperation({
    summary: 'Publier une expérience (la rendre visible publiquement)',
  })
  @ApiParam({ name: 'id', description: "ID de l'expérience (UUID)" })
  @ApiUpdateResponse(ExperienceEntity)
  publish(@Param('id') id: string) {
    return this.experiencesService.publish(id);
  }

  @Patch(':id/unpublish')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Dépublier une expérience (brouillon)' })
  @ApiParam({ name: 'id', description: "ID de l'expérience (UUID)" })
  @ApiUpdateResponse(ExperienceEntity)
  unpublish(@Param('id') id: string) {
    return this.experiencesService.unpublish(id);
  }

  @Get('all/including-deleted')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary:
      'Récupérer toutes les expériences (actives et inactives) - Admin uniquement',
  })
  @ApiGetManyResponse(ExperienceEntity)
  findAllIncludingDeleted() {
    return this.experiencesService.findAllIncludingDeleted();
  }

  @Get('admin/:id')
  @ApiOperation({
    summary:
      "Récupérer une expérience (Admin) - inclut les expériences inactives/non publiées avec réservations et avis",
  })
  @ApiParam({ name: 'id', description: "ID de l'expérience (UUID)" })
  @ApiGetOneResponse(ExperienceEntity)
  findOneAdmin(@Param('id') id: string) {
    return this.experiencesService.findOneAdmin(id);
  }

  @Get('guide/:guideId/drafts')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: "Récupérer les expériences brouillons d'un guide" })
  @ApiParam({ name: 'guideId', description: 'ID du guide (UUID)' })
  @ApiGetManyResponse(ExperienceEntity)
  findDraftsByGuide(@Param('guideId') guideId: string) {
    return this.experiencesService.findDraftsByGuide(guideId);
  }

  // === ÉTAPES D'EXPÉRIENCE ===
  @Put(':id/steps')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: "Remplacer les étapes d'une expérience" })
  @ApiParam({ name: 'id', description: "ID de l'expérience (UUID)" })
  @ApiUpdateResponse(Object)
  replaceSteps(
    @Param('id') id: string,
    @Body() steps: { step_number: number; title: string; description?: string }[],
  ) {
    return this.experiencesService.replaceSteps(id, steps);
  }

  // === CATÉGORIES D'EXPÉRIENCE ===
  @Post(':id/categories')
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Lier une catégorie à une expérience" })
  @ApiParam({ name: 'id', description: "ID de l'expérience (UUID)" })
  @ApiCreateResponse(Object)
  addCategory(
    @Param('id') id: string,
    @Body('category_id') categoryId: string,
  ) {
    return this.experienceCategoriesService.create(id, categoryId);
  }

  @Delete(':id/categories/:categoryId')
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Supprimer la liaison catégorie-expérience" })
  @ApiParam({ name: 'id', description: "ID de l'expérience (UUID)" })
  @ApiParam({ name: 'categoryId', description: 'ID de la catégorie (UUID)' })
  @ApiDeleteResponse()
  removeCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.experienceCategoriesService.delete(id, categoryId);
  }

  // === DISPONIBILITÉS ===
  @Post(':experienceId/availability')
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Créer une disponibilité pour une expérience" })
  @ApiParam({
    name: 'experienceId',
    description: "ID de l'expérience",
  })
  @ApiCreateResponse(Object)
  createAvailability(
    @Body() createAvailabilityDto: CreateExperienceAvailabilityDto,
  ) {
    return this.experienceAvailabilityService.create(createAvailabilityDto);
  }

  @Get(':experienceId/availability')
  @Public()
  @ApiOperation({
    summary: "Récupérer les disponibilités d'une expérience",
  })
  @ApiParam({
    name: 'experienceId',
    description: "ID de l'expérience",
  })
  @ApiGetManyResponse(Object)
  findAvailabilityByExperience(@Param('experienceId') experienceId: string) {
    return this.experienceAvailabilityService.findByExperience(experienceId);
  }
}

@ApiTags('Catégories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une catégorie' })
  @ApiCreateResponse(Object)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Récupérer toutes les catégories' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer une catégorie' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une catégorie' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie' })
  @ApiUpdateResponse(Object)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une catégorie' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
