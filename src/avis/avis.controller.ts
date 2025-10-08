import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AvisService } from './avis.service';
import { AbonnementsService } from './abonnements.service';
import { CreateAvisDto } from './dto/create-avis.dto';
import { UpdateAvisDto } from './dto/update-avis.dto';
import { CreateAbonnementDto } from './dto/create-abonnement.dto';
import { UpdateAbonnementDto } from './dto/update-abonnement.dto';
import { AvisEntity } from './entities/avis.entity';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';

@ApiTags('Avis')
@Controller('avis')
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un avis' })
  @ApiCreateResponse(AvisEntity)
  create(@Body() createAvisDto: CreateAvisDto) {
    return this.avisService.create(createAvisDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les avis' })
  @ApiGetManyResponse(AvisEntity)
  findAll() {
    return this.avisService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un avis par son ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'avis' })
  @ApiGetOneResponse(AvisEntity)
  findOne(@Param('id') id: string) {
    return this.avisService.findOne(id);
  }

  @Get('experience/:experienceId')
  @ApiOperation({ summary: 'Récupérer les avis d\'une expérience' })
  @ApiParam({ name: 'experienceId', description: 'ID de l\'expérience' })
  @ApiGetManyResponse(AvisEntity)
  findByExperience(@Param('experienceId') experienceId: string) {
    return this.avisService.findByExperience(experienceId);
  }

  @Get('utilisateur/:utilisateurId')
  @ApiOperation({ summary: 'Récupérer les avis d\'un utilisateur' })
  @ApiParam({ name: 'utilisateurId', description: 'ID de l\'utilisateur' })
  @ApiGetManyResponse(AvisEntity)
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.avisService.findByUtilisateur(utilisateurId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un avis' })
  @ApiParam({ name: 'id', description: 'ID de l\'avis' })
  @ApiUpdateResponse(AvisEntity)
  update(@Param('id') id: string, @Body() updateAvisDto: UpdateAvisDto) {
    return this.avisService.update(id, updateAvisDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un avis' })
  @ApiParam({ name: 'id', description: 'ID de l\'avis' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.avisService.delete(id);
  }
}

@ApiTags('Abonnements')
@Controller('abonnements')
export class AbonnementsController {
  constructor(private readonly abonnementsService: AbonnementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un abonnement' })
  @ApiCreateResponse(Object)
  create(@Body() createAbonnementDto: CreateAbonnementDto) {
    return this.abonnementsService.create(createAbonnementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les abonnements' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.abonnementsService.findAll();
  }

  @Get('actifs')
  @ApiOperation({ summary: 'Récupérer les abonnements actifs' })
  @ApiGetManyResponse(Object)
  findActive() {
    return this.abonnementsService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un abonnement' })
  @ApiParam({ name: 'id', description: 'ID de l\'abonnement' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.abonnementsService.findOne(id);
  }

  @Get('utilisateur/:utilisateurId')
  @ApiOperation({ summary: 'Récupérer les abonnements d\'un utilisateur' })
  @ApiParam({ name: 'utilisateurId', description: 'ID de l\'utilisateur' })
  @ApiGetManyResponse(Object)
  findByUtilisateur(@Param('utilisateurId') utilisateurId: string) {
    return this.abonnementsService.findByUtilisateur(utilisateurId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un abonnement' })
  @ApiParam({ name: 'id', description: 'ID de l\'abonnement' })
  @ApiUpdateResponse(Object)
  update(@Param('id') id: string, @Body() updateAbonnementDto: UpdateAbonnementDto) {
    return this.abonnementsService.update(id, updateAbonnementDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un abonnement' })
  @ApiParam({ name: 'id', description: 'ID de l\'abonnement' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.abonnementsService.delete(id);
  }
}
