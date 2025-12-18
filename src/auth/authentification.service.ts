import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthentificationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (
      !user ||
      !(await this.usersService.validatePassword(
        loginDto.password,
        user.password,
      ))
    ) {
      throw new NotFoundException(`Email ou mot de passe incorrect`);
    }

    const payload = { userId: user.id };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const user = await this.usersService.create(registerDto);

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Sauvegarder le refresh token
    await this.usersService.update(user.id, {
      refresh_token: tokens.refreshToken,
    });

    // Envoyer l'email de bienvenue
    this.mailService
      .sendWelcomeEmail(user.email, `${user.first_name} ${user.last_name}`)
      .catch((error) =>
        console.error("Erreur lors de l'envoi de l'email de bienvenue:", error),
      );

    return {
      user,
      ...tokens,
    };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Vérifier le refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);

      if (!user || user.refresh_token !== refreshToken) {
        throw new UnauthorizedException('Refresh token invalide');
      }

      // Générer de nouveaux tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      // Mettre à jour le refresh token en base
      await this.usersService.update(user.id, {
        refresh_token: tokens.refreshToken,
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
  }

  async logout(userId: string) {
    // Supprimer le refresh token de la base de données
    await this.usersService.update(userId, {
      refresh_token: null,
    });

    return {
      message: 'Déconnexion réussie. Le refresh token a été révoqué.',
      success: true,
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findByEmail(changePasswordDto.email);
    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'email ${changePasswordDto.email} introuvable`,
      );
    }
    return this.usersService.update(user.id, {
      password: changePasswordDto.password,
    });
  }

  // ========== MÉTHODES PRIVÉES ==========

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = {
      sub: userId,
      email: email,
      role: role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      // Access Token court (15 minutes)
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      // Refresh Token long (7 jours)
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
