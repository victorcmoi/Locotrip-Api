import { Module } from '@nestjs/common';
import { VillesController, ExperiencesController, CategoriesController } from './experiences.controller';
import { VillesService } from './cities.service';
import { ExperiencesService } from './experiences.service';
import { CategoriesService } from './categories.service';
import { ExperienceCategoriesService } from './experience-categories.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [VillesController, ExperiencesController, CategoriesController],
  providers: [
    VillesService,
    ExperiencesService,
    CategoriesService,
    ExperienceCategoriesService,
    PrismaService,
  ],
  exports: [
    VillesService,
    ExperiencesService,
    CategoriesService,
    ExperienceCategoriesService,
  ],
})
export class ExperiencesModule {}
