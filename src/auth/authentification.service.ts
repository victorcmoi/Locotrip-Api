import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/user.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthentificationService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}
    
    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !(await this.usersService.validatePassword(loginDto.password, user.password))) {
            throw new NotFoundException(`Email ou mot de passe incorrect`);
        }
        const payload = { 
            sub: user.id, 
            email: user.email,
            role: user.role
        };
        return {
            token: await this.jwtService.signAsync(payload),
        };
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const user = await this.usersService.findByEmail(changePasswordDto.email);
        if (!user) {
        throw new NotFoundException(`Utilisateur avec l'email ${changePasswordDto.email} introuvable`);
        }
        return this.usersService.update(user.id, { password: changePasswordDto.password });
    }

    async register(registerDto: RegisterDto): Promise<{ user: any; token: string }> {
        const user = await this.usersService.create(registerDto);
        
        const payload = { 
            sub: user.id, 
            email: user.email,
            role: user.role
        };
        
        return {
            user,
            token: await this.jwtService.signAsync(payload),
        };
    }

    async logout() {
        return {
            message: 'Déconnexion réussie',
            success: true
        };
    }
}