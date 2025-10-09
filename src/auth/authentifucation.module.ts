import { RolesGuard } from './guards/roles.guard';
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./guards/authentification.guard";
import { AuthentificationController } from "./authentification.controller";
import { AuthentificationService } from "./authentification.service";
import { UtilisateursModule } from "../utilisateurs/utilisateurs.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_API_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_TIME},
    }),
    UtilisateursModule
  ],
  controllers: [AuthentificationController],
  providers: [
    AuthentificationService,
    {provide: 'APP_GUARD', useClass: AuthGuard}, 
    {provide: 'APP_GUARD', useClass: RolesGuard}
  ]
})
export class AuthentificationModule {}