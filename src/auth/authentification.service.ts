import { Injectable, NotFoundException } from "@nestjs/common";
import { UtilisateursService } from "../utilisateurs/utilisateurs.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthentificationService {
    constructor(private utilisateursService: UtilisateursService, private jwtService: JwtService) {}
    
    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const utilisateur = await this.utilisateursService.findByEmail(loginDto.email);
        if (!utilisateur || !(await this.utilisateursService.validatePassword(loginDto.mot_de_passe, utilisateur.mot_de_passe))) {
            throw new NotFoundException(`Email ou mot de passe incorrect`);
        }
        const payload = { 
            sub: utilisateur.id, 
            email: utilisateur.email,
            role: utilisateur.role
        };
        return {
            token: await this.jwtService.signAsync(payload),
        };
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const utilisateur = await this.utilisateursService.findByEmail(changePasswordDto.email);
        if (!utilisateur) {
        throw new NotFoundException(`Utilisateur avec l'email ${changePasswordDto.email} introuvable`);
        }
        return this.utilisateursService.update(utilisateur.id, { mot_de_passe: changePasswordDto.mot_de_passe });
    }

    async register(registerDto: RegisterDto): Promise<{ utilisateur: any; token: string }> {
        const utilisateur = await this.utilisateursService.create(registerDto);
        
        const payload = { 
            sub: utilisateur.id, 
            email: utilisateur.email,
            role: utilisateur.role
        };
        
        return {
            utilisateur,
            token: await this.jwtService.signAsync(payload),
        };
    }
}