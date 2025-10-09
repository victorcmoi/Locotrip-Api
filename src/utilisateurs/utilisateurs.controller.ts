import { Public } from './../common/decorators/authentification-decorator';
import { AuthentificationService } from '../auth/authentification.service';
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UtilisateursService } from './utilisateurs.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { UtilisateurEntity } from './entities/utilisateur.entity';
import { 
  ApiCreateResponse, 
  ApiGetManyResponse, 
  ApiGetOneResponse, 
  ApiUpdateResponse, 
  ApiDeleteResponse 
} from '../common/decorators/api-standard-responses.decorator';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { Roles } from '../common/decorators/role.decorator';
import { RoleUtilisateur } from './enums/utilisateur.enum';

@ApiTags('Utilisateurs')
@ApiBearerAuth('JWT-auth')
@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private readonly utilisateursService: UtilisateursService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiCreateResponse(UtilisateurEntity)
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateursService.create(createUtilisateurDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiGetManyResponse(UtilisateurEntity)
  findAll() {
    return this.utilisateursService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur (UUID)' })
  @ApiGetOneResponse(UtilisateurEntity)
  findOne(@Param('id') id: string) {
    return this.utilisateursService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son email' })
  @ApiParam({ name: 'email', description: 'Email de l\'utilisateur' })
  @ApiGetOneResponse(UtilisateurEntity)
  findByEmail(@Param('email') email: string) {
    return this.utilisateursService.findByEmail(email);
  }

  @Put(':id')
  @Roles(RoleUtilisateur.CLIENT)
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur (UUID)' })
  @ApiUpdateResponse(UtilisateurEntity)
  update(@Param('id') id: string, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.utilisateursService.update(id, updateUtilisateurDto);
  }

  @Delete(':id')
  @Roles(RoleUtilisateur.CLIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur (UUID)' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.utilisateursService.delete(id);
  }
}
