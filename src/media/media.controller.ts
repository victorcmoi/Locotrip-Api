import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { MediaService } from './media.service';
import { Prisma } from '@prisma/client';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.mediaCreateInput) {
    return this.mediaService.create(data);
  }

  @Get()
  findAll(@Query('type') type?: string) {
    if (type) {
      return this.mediaService.findByType(type);
    }
    return this.mediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Get('entity/:entityType/:entityId')
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.mediaService.findByEntity(entityType, entityId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.mediaUpdateInput) {
    return this.mediaService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.mediaService.delete(id);
  }
}
