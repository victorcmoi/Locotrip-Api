import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { experiencePriceService } from './experience-price.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CreateExperiencePriceDto } from './dto/create-experience-price.dto';
import { UpdateExperiencePriceDto } from './dto/update-experience-price.dto';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';
import { UserRole } from '../users/enums/user.enum';
import { Roles } from '../common/decorators/role.decorator';

@ApiTags('Devises')
@ApiBearerAuth('JWT-auth')
@Controller('currencies')
export class CurrenciesController {
  constructor(
    private readonly currenciesService: CurrenciesService,
    private readonly experiencePriceService: experiencePriceService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une currency' })
  @ApiCreateResponse(CreateCurrencyDto)
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer toutes les currencies' })
  @ApiGetManyResponse(CreateCurrencyDto)
  findAll() {
    return this.currenciesService.findAll();
  }

  @Get(':code')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer une currency par son code' })
  @ApiParam({ name: 'code', description: 'Code de la currency (ex: EUR, USD)' })
  @ApiGetOneResponse(CreateCurrencyDto)
  findOne(@Param('code') code: string) {
    return this.currenciesService.findOne(code);
  }

  @Put(':code')
  @ApiOperation({ summary: 'Mettre à jour une currency' })
  @ApiParam({ name: 'code', description: 'Code de la currency' })
  @ApiUpdateResponse(CreateCurrencyDto)
  update(@Param('code') code: string, @Body() updateCurrencyDto: UpdateCurrencyDto) {
    return this.currenciesService.update(code, updateCurrencyDto);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une currency' })
  @ApiParam({ name: 'code', description: 'Code de la currency' })
  @ApiDeleteResponse()
  delete(@Param('code') code: string) {
    return this.currenciesService.delete(code);
  }
}

@ApiTags('Prix des expériences')
@ApiBearerAuth('JWT-auth')
@Controller('experience-price')
export class ExperiencePrixController {
  constructor(private readonly experiencePriceService: experiencePriceService) {}

  @Post()
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un price pour une expérience' })
  @ApiCreateResponse(Object)
  create(@Body() createExperiencePrixDto: CreateExperiencePriceDto) {
    return this.experiencePriceService.create(createExperiencePrixDto);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer tous les price' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.experiencePriceService.findAll();
  }

  @Get('experience/:experienceId')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer les price d\'une expérience' })
  @ApiParam({ name: 'experienceId', description: 'ID de l\'expérience' })
  @ApiGetManyResponse(Object)
  findByExperience(@Param('experienceId') experienceId: string) {
    return this.experiencePriceService.findByExperience(experienceId);
  }

  @Get('currency/:currencyCode')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer les price dans une currency' })
  @ApiParam({ name: 'currencyCode', description: 'Code de la currency' })
  @ApiGetManyResponse(Object)
  findByCurrency(@Param('currencyCode') currencyCode: string) {
    return this.experiencePriceService.findByCurrency(currencyCode);
  }

  @Put(':experienceId/:currencyCode')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Mettre à jour un price' })
  @ApiParam({ name: 'experienceId', description: 'ID de l\'expérience' })
  @ApiParam({ name: 'currencyCode', description: 'Code de la currency' })
  @ApiUpdateResponse(Object)
  update(
    @Param('experienceId') experienceId: string,
    @Param('currencyCode') currencyCode: string,
    @Body() updateExperiencePrixDto: UpdateExperiencePriceDto,
  ) {
    return this.experiencePriceService.update(experienceId, currencyCode, updateExperiencePrixDto);
  }

  @Delete(':experienceId/:currencyCode')
  @Roles(UserRole.GUIDE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un price' })
  @ApiParam({ name: 'experienceId', description: 'ID de l\'expérience' })
  @ApiParam({ name: 'currencyCode', description: 'Code de la currency' })
  @ApiDeleteResponse()
  delete(
    @Param('experienceId') experienceId: string,
    @Param('currencyCode') currencyCode: string,
  ) {
    return this.experiencePriceService.delete(experienceId, currencyCode);
  }
}
