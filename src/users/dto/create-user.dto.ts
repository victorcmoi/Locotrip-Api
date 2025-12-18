import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user.enum';

export class CreateUserDto {
  @ApiProperty({
    description: "Nom de famille de l'utilisateur",
    example: 'Dupont',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: 'Jean',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'jean.dupont@example.com',
    maxLength: 100,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur (sera hashé)",
    example: 'MonMotDePasse123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description:
      "Rôle de l'utilisateur dans la plateforme (guide, client ou admin)",
    enum: UserRole,
    example: UserRole.CLIENT,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
