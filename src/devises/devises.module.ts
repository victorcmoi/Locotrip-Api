import { Module } from '@nestjs/common';
import { DevisesController, ExperiencePrixController } from './devises.controller';
import { DevisesService } from './devises.service';
import { ExperiencePrixService } from './experience-prix.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DevisesController, ExperiencePrixController],
  providers: [DevisesService, ExperiencePrixService, PrismaService],
  exports: [DevisesService, ExperiencePrixService],
})
export class DevisesModule {}
