import { AuthentificationService } from "./authentification.service";
import { Roles } from "../common/decorators/role.decorator";
import { RoleUtilisateur } from "../utilisateurs/enums/utilisateur.enum";
import { Public } from "../common/decorators/authentification-decorator";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { HttpCode } from "@nestjs/common/decorators/http/http-code.decorator";
import { UtilisateurEntity } from "../utilisateurs/entities/utilisateur.entity";
import { ApiCreateResponse, ApiGetOneResponse, ApiUpdateResponse } from "../common/decorators/api-standard-responses.decorator";
import { LoginDto } from "./dto/login.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { Body, Controller } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";

@ApiTags('Authentification')
@ApiBearerAuth('JWT-auth')
@Controller('auth')
export class AuthentificationController {
    constructor(private readonly authentificationService: AuthentificationService) {}

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
    @ApiCreateResponse(UtilisateurEntity)
    register(@Body() registerDto: RegisterDto) {
        return this.authentificationService.register(registerDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Connexion d\'un utilisateur' })
    @ApiGetOneResponse(UtilisateurEntity)
    login(@Body() loginDto: LoginDto) {
        return this.authentificationService.login(loginDto);
    }

    @Post('change-password')
    @Roles(RoleUtilisateur.CLIENT, RoleUtilisateur.GUIDE)
    @ApiOperation({ summary: 'Changer le mot de passe d\'un utilisateur' })
    @ApiUpdateResponse(UtilisateurEntity)
    changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.authentificationService.changePassword(changePasswordDto);
    }

}