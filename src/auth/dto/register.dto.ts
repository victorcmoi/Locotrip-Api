import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRole } from "../../users/enums/user.enum";

export class RegisterDto {
      @ApiProperty({
        description: 'Nom de famille de l\'user',
        example: 'Dupont',
        maxLength: 100,
      })
      @IsString()
      @IsNotEmpty()
      last_name: string;
    
      @ApiProperty({
        description: 'Prénom de l\'user',
        example: 'Jean',
        maxLength: 50,
      })
      @IsString()
      @IsNotEmpty()
      first_name: string;
    
      @ApiProperty({
        description: 'Adresse email de l\'user',
        example: 'jean.dupont@example.com',
        maxLength: 100,
      })
      @IsEmail()
      @IsNotEmpty()
      email: string;
    
      @ApiProperty({
        description: 'Mot de passe de l\'user (minimum 8 caractères)',
        example: 'MonMotDePasse123!',
        minLength: 8,
      })
      @IsString()
      @IsNotEmpty()
      @MinLength(8)
      password: string;

      @ApiProperty({
        description: 'Rôle de l\'user : CLIENT (voyageur) ou GUIDE (guide touristique)',
        enum: [UserRole.CLIENT, UserRole.GUIDE],
        example: UserRole.CLIENT,
      })
      @IsEnum(UserRole, {
        message: 'Le rôle doit être CLIENT ou GUIDE',
      })
      @IsNotEmpty()
      role: UserRole.CLIENT | UserRole.GUIDE;
}