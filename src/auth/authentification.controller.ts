import { AuthentificationService } from "./authentification.service";
import { Roles } from "../common/decorators/role.decorator";
import { UserRole } from "../users/enums/user.enum";
import { Public } from "../common/decorators/authentification-decorator";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { HttpCode } from "@nestjs/common/decorators/http/http-code.decorator";
import { UserEntity } from "../users/entities/user.entity";
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

    @Post('register')
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
    @ApiCreateResponse(UserEntity)
    register(@Body() registerDto: RegisterDto) {
        return this.authentificationService.register(registerDto);
    }

    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Connexion d\'un utilisateur' })
    @ApiGetOneResponse(UserEntity)
    login(@Body() loginDto: LoginDto) {
        return this.authentificationService.login(loginDto);
    }

    @Post('logout')
    @Roles(UserRole.CLIENT, UserRole.GUIDE, UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Déconnexion d\'un utilisateur' })
    @ApiGetOneResponse(String)
    logout() {
        return this.authentificationService.logout();
    }

    @Post('change-password')
    @Roles(UserRole.CLIENT, UserRole.GUIDE)
    @ApiOperation({ summary: 'Changer le mot de passe d\'un utilisateur' })
    @ApiUpdateResponse(UserEntity)
    changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.authentificationService.changePassword(changePasswordDto);
    }

}