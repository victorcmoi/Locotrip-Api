import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';
import { MediaType } from '@prisma/client';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '../users/enums/user.enum';
import { Public } from '../common/decorators/authentification-decorator';

@ApiTags('Médias')
@ApiBearerAuth('JWT-auth')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ajouter un média' })
  @ApiCreateResponse(Object)
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les médias' })
  @ApiQuery({ name: 'type', required: false, description: 'Filtrer par type de média' })
  @ApiGetManyResponse(Object)
  findAll(@Query('type') type?: MediaType) {
    if (type) {
      return this.mediaService.findByType(type);
    }
    return this.mediaService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer un média' })
  @ApiParam({ name: 'id', description: 'ID du média' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Get('entity/:entityType/:entityId')
  @Public()
  @ApiOperation({ summary: 'Récupérer les médias d\'une entité' })
  @ApiParam({ name: 'entityType', description: 'Type d\'entité (experience, guide, etc.)' })
  @ApiParam({ name: 'entityId', description: 'ID de l\'entité' })
  @ApiGetManyResponse(Object)
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.mediaService.findByEntity(entityType, entityId);
  }

  @Put(':id')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Mettre à jour un média' })
  @ApiParam({ name: 'id', description: 'ID du média' })
  @ApiUpdateResponse(Object)
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(id, updateMediaDto);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un média' })
  @ApiParam({ name: 'id', description: 'ID du média' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.mediaService.delete(id);
  }
}
