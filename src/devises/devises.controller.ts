import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { DevisesService } from './devises.service';
import { ExperiencePrixService } from './experience-prix.service';
import { Prisma } from '@prisma/client';

@Controller('devises')
export class DevisesController {
  constructor(
    private readonly devisesService: DevisesService,
    private readonly experiencePrixService: ExperiencePrixService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.deviseCreateInput) {
    return this.devisesService.create(data);
  }

  @Get()
  findAll() {
    return this.devisesService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.devisesService.findOne(code);
  }

  @Put(':code')
  update(@Param('code') code: string, @Body() data: Prisma.deviseUpdateInput) {
    return this.devisesService.update(code, data);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('code') code: string) {
    return this.devisesService.delete(code);
  }
}

@Controller('experience-prix')
export class ExperiencePrixController {
  constructor(private readonly experiencePrixService: ExperiencePrixService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.experience_prixCreateInput) {
    return this.experiencePrixService.create(data);
  }

  @Get()
  findAll() {
    return this.experiencePrixService.findAll();
  }

  @Get('experience/:experienceId')
  findByExperience(@Param('experienceId') experienceId: string) {
    return this.experiencePrixService.findByExperience(experienceId);
  }

  @Get('devise/:deviseCode')
  findByDevise(@Param('deviseCode') deviseCode: string) {
    return this.experiencePrixService.findByDevise(deviseCode);
  }

  @Put(':experienceId/:deviseCode')
  update(
    @Param('experienceId') experienceId: string,
    @Param('deviseCode') deviseCode: string,
    @Body() data: Prisma.experience_prixUpdateInput,
  ) {
    return this.experiencePrixService.update(experienceId, deviseCode, data);
  }

  @Delete(':experienceId/:deviseCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('experienceId') experienceId: string,
    @Param('deviseCode') deviseCode: string,
  ) {
    return this.experiencePrixService.delete(experienceId, deviseCode);
  }
}
