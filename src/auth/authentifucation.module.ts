import { RolesGuard } from './guards/roles.guard';
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./guards/authentification.guard";
import { AuthentificationController } from "./authentification.controller";
import { AuthentificationService } from "./authentification.service";
import { UsersModule } from "../users/user.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION},
    }),
    UsersModule
  ],
  controllers: [AuthentificationController],
  providers: [
    AuthentificationService,
    {provide: 'APP_GUARD', useClass: AuthGuard}, 
    {provide: 'APP_GUARD', useClass: RolesGuard}
  ]
})
export class AuthentificationModule {}