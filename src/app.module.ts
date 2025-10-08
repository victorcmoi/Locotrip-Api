import { Module } from '@nestjs/common';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';
import { GuidesModule } from './guides/guides.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AvisModule } from './avis/avis.module';
import { MessagerieModule } from './messagerie/messagerie.module';
import { SupportModule } from './support/support.module';
import { MediaModule } from './media/media.module';
import { DevisesModule } from './devises/devises.module';

@Module({
  imports: [
    UtilisateursModule,
    GuidesModule,
    ExperiencesModule,
    ReservationsModule,
    AvisModule,
    MessagerieModule,
    SupportModule,
    MediaModule,
    DevisesModule,
  ],
})
export class AppModule {}
