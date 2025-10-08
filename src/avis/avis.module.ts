import { Module } from '@nestjs/common';
import { AvisController, AbonnementsController } from './avis.controller';
import { AvisService } from './avis.service';
import { AbonnementsService } from './abonnements.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AvisController, AbonnementsController],
  providers: [AvisService, AbonnementsService, PrismaService],
  exports: [AvisService, AbonnementsService],
})
export class AvisModule {}
