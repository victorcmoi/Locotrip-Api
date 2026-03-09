import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class RegisterGuideDto {
  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: 'Jean',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: "Nom de famille de l'utilisateur",
    example: 'Dupont',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'jean.dupont@example.com',
    maxLength: 100,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur (minimum 8 caractères)",
    example: 'MonMotDePasse123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: "Date de naissance de l'utilisateur",
    example: '1990-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  birth_date: string;

  @ApiPropertyOptional({
    description: "Numéro de téléphone de l'utilisateur",
    example: '+33612345678',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  // ===== Guide-specific fields =====

  @ApiProperty({
    description: 'Biographie du guide (minimum 50 caractères)',
    example: "Guide passionné avec 10 ans d'expérience à Paris",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  bio: string;

  @ApiProperty({
    description: 'Pays du guide',
    example: 'France',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Langues parlées par le guide (séparées par des virgules)',
    example: 'Français, Anglais, Espagnol',
  })
  @IsString()
  @IsNotEmpty()
  languages: string;

  @ApiProperty({
    description: "Années d'expérience en tant que guide",
    example: 5,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Max(99)
  years_of_experience: number;
}
