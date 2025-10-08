import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { VillesService } from './villes.service';
import { ExperiencesService } from './experiences.service';
import { CategoriesService } from './categories.service';
import { ExperienceCategoriesService } from './experience-categories.service';
import { CreateVilleDto } from './dto/create-ville.dto';
import { UpdateVilleDto } from './dto/update-ville.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { ExperienceEntity } from './entities/experience.entity';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';

@ApiTags('Villes')
@Controller('villes')
export class VillesController {
  constructor(private readonly villesService: VillesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une ville' })
  create(@Body() createVilleDto: CreateVilleDto) {
    return this.villesService.create(createVilleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les villes' })
  findAll() {
    return this.villesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une ville' })
  @ApiParam({ name: 'id', description: 'ID de la ville' })
  findOne(@Param('id') id: string) {
    return this.villesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une ville' })
  @ApiParam({ name: 'id', description: 'ID de la ville' })
  update(@Param('id') id: string, @Body() updateVilleDto: UpdateVilleDto) {
    return this.villesService.update(id, updateVilleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une ville' })
  @ApiParam({ name: 'id', description: 'ID de la ville' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.villesService.delete(id);
  }
}

@ApiTags('Expériences')
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une expérience' })
  @ApiCreateResponse(ExperienceEntity)
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experiencesService.create(createExperienceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les expériences' })
  @ApiGetManyResponse(ExperienceEntity)
  findAll() {
    return this.experiencesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une expérience' })
  @ApiParam({ name: 'id', description: 'ID de l\'expérience' })
  @ApiGetOneResponse(ExperienceEntity)
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Get('ville/:villeId')
  @ApiOperation({ summary: 'Récupérer les expériences d\'une ville' })
  @ApiParam({ name: 'villeId', description: 'ID de la ville' })
  @ApiGetManyResponse(ExperienceEntity)
  findByVille(@Param('villeId') villeId: string) {
    return this.experiencesService.findByVille(villeId);
  }

  @Get('guide/:guideId')
  @ApiOperation({ summary: 'Récupérer les expériences d\'un guide' })
  @ApiParam({ name: 'guideId', description: 'ID du guide' })
  @ApiGetManyResponse(ExperienceEntity)
  findByGuide(@Param('guideId') guideId: string) {
    return this.experiencesService.findByGuide(guideId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une expérience' })
  @ApiParam({ name: 'id', description: 'ID de l\'expérience' })
  @ApiUpdateResponse(ExperienceEntity)
  update(@Param('id') id: string, @Body() updateExperienceDto: UpdateExperienceDto) {
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une expérience' })
  @ApiParam({ name: 'id', description: 'ID de l\'expérience' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.experiencesService.delete(id);
  }
}

@ApiTags('Catégories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une catégorie' })
  @ApiCreateResponse(Object)
  create(@Body() createCategorieDto: CreateCategorieDto) {
    return this.categoriesService.create(createCategorieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les catégories' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
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
  update(@Param('id') id: string, @Body() updateCategorieDto: UpdateCategorieDto) {
    return this.categoriesService.update(id, updateCategorieDto);
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
