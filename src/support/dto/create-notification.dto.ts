import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { TypeNotification } from '../../../prisma/enums';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  utilisateur_id: string;

  @ApiProperty({
    description: 'Type de notification',
    enum: TypeNotification,
    example: TypeNotification.NOUVEAU_MESSAGE,
  })
  @IsNotEmpty()
  @IsEnum(TypeNotification)
  type: TypeNotification;

  @ApiProperty({
    description: 'Contenu de la notification',
    example: 'Vous avez reçu un nouveau message',
  })
  @IsNotEmpty()
  @IsString()
  contenu: string;

  @ApiPropertyOptional({
    description: 'Statut de lecture de la notification',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  lu?: boolean;
}
