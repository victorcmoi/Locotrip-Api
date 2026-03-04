import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateTokenDto {
  @ApiProperty({ description: "Identité de l'utilisateur (ex: prénom ou ID)" })
  @IsString()
  @IsNotEmpty()
  identity: string;

  @ApiProperty({ description: 'Nom du salon vidéo (ex: conversationId)' })
  @IsString()
  @IsNotEmpty()
  room: string;
}
