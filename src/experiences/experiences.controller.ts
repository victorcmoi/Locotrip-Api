import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { VillesService } from './villes.service';
import { ExperiencesService } from './experiences.service';
import { CategoriesService } from './categories.service';
import { ExperienceCategoriesService } from './experience-categories.service';
import { Prisma } from '@prisma/client';

@Controller('villes')
export class VillesController {
  constructor(private readonly villesService: VillesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.villeCreateInput) {
    return this.villesService.create(data);
  }

  @Get()
  findAll() {
    return this.villesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.villesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.villeUpdateInput) {
    return this.villesService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.villesService.delete(id);
  }
}

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.experienceCreateInput) {
    return this.experiencesService.create(data);
  }

  @Get()
  findAll() {
    return this.experiencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Get('ville/:villeId')
  findByVille(@Param('villeId') villeId: string) {
    return this.experiencesService.findByVille(villeId);
  }

  @Get('guide/:guideId')
  findByGuide(@Param('guideId') guideId: string) {
    return this.experiencesService.findByGuide(guideId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.experienceUpdateInput) {
    return this.experiencesService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.experiencesService.delete(id);
  }
}

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.categorieCreateInput) {
    return this.categoriesService.create(data);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.categorieUpdateInput) {
    return this.categoriesService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
