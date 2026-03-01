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
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SoftDeleteUserDto } from './dto/soft-delete-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UserEntity } from './entities/user.entity';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from './enums/user.enum';

@ApiTags('Utilisateurs')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiCreateResponse(UserEntity)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiGetManyResponse(UserEntity)
  findAll(@Query() query: FindAllUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur (UUID)" })
  @ApiGetOneResponse(UserEntity)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Récupérer un utilisateur par son email' })
  @ApiParam({ name: 'email', description: "Email de l'utilisateur" })
  @ApiGetOneResponse(UserEntity)
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // TODO: Ajouter roles pour la mise à jour du compte
  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur (UUID)" })
  @ApiUpdateResponse(UserEntity)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur (UUID)" })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  // TODO: Ajouter role ADMIN pour la suppression du compte
  @Delete(':id/soft')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Désactiver un utilisateur (soft delete)' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur (UUID)" })
  @ApiBody({ type: SoftDeleteUserDto })
  @ApiUpdateResponse(UserEntity)
  softDelete(
    @Param('id') id: string,
    @Body() softDeleteDto: SoftDeleteUserDto,
  ) {
    return this.usersService.softDelete(id, softDeleteDto.reason);
  }

  @Patch(':id/restore')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Réactiver un utilisateur désactivé' })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur (UUID)" })
  @ApiUpdateResponse(UserEntity)
  restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }

  @Patch(':id/verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Vérifier l'email d'un utilisateur" })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur (UUID)" })
  @ApiUpdateResponse(UserEntity)
  verifyEmail(@Param('id') id: string) {
    return this.usersService.verifyEmail(id);
  }

  @Get('all/including-deleted')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary:
      'Récupérer tous les utilisateurs (actifs et inactifs) - Admin uniquement',
  })
  @ApiGetManyResponse(UserEntity)
  findAllIncludingDeleted() {
    return this.usersService.findAllIncludingDeleted();
  }
}
