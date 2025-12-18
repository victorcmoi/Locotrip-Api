import { Module } from '@nestjs/common';
import {
  CitiesController,
  ExperiencesController,
  CategoriesController,
} from './experiences.controller';
import { CitiesService } from './cities.service';
import { ExperiencesService } from './experiences.service';
import { CategoriesService } from './categories.service';
import { ExperienceCategoriesService } from './experience-categories.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CitiesController, ExperiencesController, CategoriesController],
  providers: [
    CitiesService,
    ExperiencesService,
    CategoriesService,
    ExperienceCategoriesService,
    PrismaService,
  ],
  exports: [
    CitiesService,
    ExperiencesService,
    CategoriesService,
    ExperienceCategoriesService,
  ],
})
export class ExperiencesModule {}
