import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { ExperiencesService } from './experiences.service';
import { CategoriesService } from './categories.service';
import { ExperienceCategoriesService } from './experience-categories.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
  constructor(private readonly citiesService: CitiesService) {}

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
  findAll() {
    return this.citiesService.findAll();
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
  constructor(private readonly experiencesService: ExperiencesService) {}

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
  findAll() {
    return this.experiencesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer une expérience' })
  @ApiParam({ name: 'id', description: 'ID de l\'expérience' })
  @ApiGetOneResponse(ExperienceEntity)
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Get('city/:cityId')
  @Public()
  @ApiOperation({ summary: 'Récupérer les expériences d\'une ville' })
  @ApiParam({ name: 'cityId', description: 'ID de la ville' })
  @ApiGetManyResponse(ExperienceEntity)
  findByVille(@Param('cityId') cityId: string) {
    return this.experiencesService.findByVille(cityId);
  }

  @Get('guide/:guideId')
  @Public()
  @ApiOperation({ summary: 'Récupérer les expériences d\'un guide' })
  @ApiParam({ name: 'guideId', description: 'ID du guide' })
  @ApiGetManyResponse(ExperienceEntity)
  findByGuide(@Param('guideId') guideId: string) {
    return this.experiencesService.findByGuide(guideId);
  }

  @Put(':id')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Mettre à jour une expérience' })
  @ApiParam({ name: 'id', description: 'ID de l\'expérience' })
  @ApiUpdateResponse(ExperienceEntity)
  update(@Param('id') id: string, @Body() updateExperienceDto: UpdateExperienceDto) {
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une expérience' })
  @ApiParam({ name: 'id', description: 'ID de l\'expérience' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.experiencesService.delete(id);
  }
}

@ApiTags('Catégories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

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
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
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
