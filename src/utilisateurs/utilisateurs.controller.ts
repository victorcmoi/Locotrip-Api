import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { Prisma } from '@prisma/client';

@Controller('utilisateurs')
export class UtilisateursController {
  constructor(private readonly utilisateursService: UtilisateursService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Prisma.utilisateurCreateInput) {
    return this.utilisateursService.create(data);
  }

  @Get()
  findAll() {
    return this.utilisateursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilisateursService.findOne(id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.utilisateursService.findByEmail(email);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.utilisateurUpdateInput) {
    return this.utilisateursService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.utilisateursService.delete(id);
  }
}
