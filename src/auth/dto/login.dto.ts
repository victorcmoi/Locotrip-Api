import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'jean.dupont@example.com',
    maxLength: 100,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'NouveauMotDePasse123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Rôle requis pour la connexion (optionnel)',
    example: 'admin',
    required: false,
  })
  @IsString()
  @IsOptional()
  requiredRole?: string;
}
