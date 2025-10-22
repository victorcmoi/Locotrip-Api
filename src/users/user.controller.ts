import { Public } from '../common/decorators/authentification-decorator';
import { AuthentificationService } from '../auth/authentification.service';
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
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
import { UserRole } from './enums/user.enum';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouvel user' })
  @ApiCreateResponse(UserEntity)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les users' })
  @ApiGetManyResponse(UserEntity)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un user par son ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'user (UUID)' })
  @ApiGetOneResponse(UserEntity)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Récupérer un user par son email' })
  @ApiParam({ name: 'email', description: 'Email de l\'user' })
  @ApiGetOneResponse(UserEntity)
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Put(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Mettre à jour un user' })
  @ApiParam({ name: 'id', description: 'ID de l\'user (UUID)' })
  @ApiUpdateResponse(UserEntity)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un user' })
  @ApiParam({ name: 'id', description: 'ID de l\'user (UUID)' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
