import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { SupportTicketStatus } from '../enums/ticket-message.enum';

export class CreateSupportTicketDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui crée le ticket",
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Sujet du ticket',
    example: 'Problème de payment',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'Statut du ticket',
    enum: SupportTicketStatus,
    example: SupportTicketStatus.OUVERT,
  })
  @IsEnum(SupportTicketStatus)
  @IsNotEmpty()
  status: SupportTicketStatus;
}
