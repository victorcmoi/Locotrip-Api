import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { DevisesService } from './devises.service';
import { ExperiencePrixService } from './experience-prix.service';
import { CreateDeviseDto } from './dto/create-devise.dto';
import { UpdateDeviseDto } from './dto/update-devise.dto';
import { CreateExperiencePrixDto } from './dto/create-experience-prix.dto';
import { UpdateExperiencePrixDto } from './dto/update-experience-prix.dto';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';

@ApiTags('Devises')
@Controller('devises')
export class DevisesController {
  constructor(
    private readonly devisesService: DevisesService,
    private readonly experiencePrixService: ExperiencePrixService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une devise' })
  @ApiCreateResponse(CreateDeviseDto)
  create(@Body() createDeviseDto: CreateDeviseDto) {
    return this.devisesService.create(createDeviseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les devises' })
  @ApiGetManyResponse(CreateDeviseDto)
  findAll() {
    return this.devisesService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Récupérer une devise par son code' })
  @ApiParam({ name: 'code', description: 'Code de la devise (ex: EUR, USD)' })
  @ApiGetOneResponse(CreateDeviseDto)
  findOne(@Param('code') code: string) {
    return this.devisesService.findOne(code);
  }

  @Put(':code')
  @ApiOperation({ summary: 'Mettre à jour une devise' })
  @ApiParam({ name: 'code', description: 'Code de la devise' })
  @ApiUpdateResponse(CreateDeviseDto)
  update(@Param('code') code: string, @Body() updateDeviseDto: UpdateDeviseDto) {
    return this.devisesService.update(code, updateDeviseDto);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une devise' })
  @ApiParam({ name: 'code', description: 'Code de la devise' })
  @ApiDeleteResponse()
  delete(@Param('code') code: string) {
    return this.devisesService.delete(code);
  }
}

@ApiTags('Prix des expériences')
@Controller('experience-prix')
export class ExperiencePrixController {
  constructor(private readonly experiencePrixService: ExperiencePrixService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un prix pour une expérience' })
  @ApiCreateResponse(Object)
  create(@Body() createExperiencePrixDto: CreateExperiencePrixDto) {
    return this.experiencePrixService.create(createExperiencePrixDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les prix' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.experiencePrixService.findAll();
  }

  @Get('experience/:experienceId')
  @ApiOperation({ summary: 'Récupérer les prix d\'une expérience' })
  @ApiParam({ name: 'experienceId', description: 'ID de l\'expérience' })
  @ApiGetManyResponse(Object)
  findByExperience(@Param('experienceId') experienceId: string) {
    return this.experiencePrixService.findByExperience(experienceId);
  }

  @Get('devise/:deviseCode')
  @ApiOperation({ summary: 'Récupérer les prix dans une devise' })
  @ApiParam({ name: 'deviseCode', description: 'Code de la devise' })
  @ApiGetManyResponse(Object)
  findByDevise(@Param('deviseCode') deviseCode: string) {
    return this.experiencePrixService.findByDevise(deviseCode);
  }

  @Put(':experienceId/:deviseCode')
  @ApiOperation({ summary: 'Mettre à jour un prix' })
  @ApiParam({ name: 'experienceId', description: 'ID de l\'expérience' })
  @ApiParam({ name: 'deviseCode', description: 'Code de la devise' })
  @ApiUpdateResponse(Object)
  update(
    @Param('experienceId') experienceId: string,
    @Param('deviseCode') deviseCode: string,
    @Body() updateExperiencePrixDto: UpdateExperiencePrixDto,
  ) {
    return this.experiencePrixService.update(experienceId, deviseCode, updateExperiencePrixDto);
  }

  @Delete(':experienceId/:deviseCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un prix' })
  @ApiParam({ name: 'experienceId', description: 'ID de l\'expérience' })
  @ApiParam({ name: 'deviseCode', description: 'Code de la devise' })
  @ApiDeleteResponse()
  delete(
    @Param('experienceId') experienceId: string,
    @Param('deviseCode') deviseCode: string,
  ) {
    return this.experiencePrixService.delete(experienceId, deviseCode);
  }
}
