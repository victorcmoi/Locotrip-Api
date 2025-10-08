import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RoleUtilisateur } from '../../../prisma/enums';

export class CreateUtilisateurDto {
  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Dupont',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'Jean',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'jean.dupont@example.com',
    maxLength: 100,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur (sera hashé)',
    example: 'MonMotDePasse123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  mot_de_passe: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur dans la plateforme (GUIDE, CLIENT ou ADMIN)',
    enum: RoleUtilisateur,
    example: RoleUtilisateur.CLIENT,
  })
  @IsEnum(RoleUtilisateur)
  @IsNotEmpty()
  role: RoleUtilisateur;
}
