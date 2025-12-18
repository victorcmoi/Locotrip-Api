import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { NotificationType } from '../enums/notification.enum';

export class CreateNotificationDto {
  @ApiProperty({
    description: "ID de l'utilisateur",
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({
    description: 'Type de notification',
    enum: NotificationType,
    example: NotificationType.NEW_MESSAGE,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Contenu de la notification',
    example: 'Vous avez reçu un nouveau message',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Statut de lecture de la notification',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
