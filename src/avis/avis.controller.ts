import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AvisService } from './avis.service';
import { AbonnementsService } from './abonnements.service';
import { Prisma } from '@prisma/client';

@Controller('avis')
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.avisCreateInput) {
    return this.avisService.create(data);
  }

  @Get()
  findAll() {
    return this.avisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avisService.findOne(id);
  }

  @Get('experience/:experienceId')
  findByExperience(@Param('experienceId') experienceId: string) {
    return this.avisService.findByExperience(experienceId);
  }

  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.avisService.findByUtilisateur(utilisateurId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.avisUpdateInput) {
    return this.avisService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.avisService.delete(id);
  }
}

@Controller('abonnements')
export class AbonnementsController {
  constructor(private readonly abonnementsService: AbonnementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.abonnementCreateInput) {
    return this.abonnementsService.create(data);
  }

  @Get()
  findAll() {
    return this.abonnementsService.findAll();
  }

  @Get('actifs')
  findActive() {
    return this.abonnementsService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abonnementsService.findOne(id);
  }

  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.abonnementsService.findByUtilisateur(utilisateurId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.abonnementUpdateInput) {
    return this.abonnementsService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.abonnementsService.delete(id);
  }
}
