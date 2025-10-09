import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({
        description: 'Adresse email de l\'utilisateur',
        example: 'jean.dupont@example.com',
        maxLength: 100,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Nouveau mot de passe de l\'utilisateur',
        example: 'NouveauMotDePasse123!',
        minLength: 8,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    mot_de_passe: string;
}