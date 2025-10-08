import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { StatutSupportTicket } from '../../../prisma/enums';

export class CreateSupportTicketDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur qui crée le ticket',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  utilisateur_id: string;

  @ApiProperty({
    description: 'Sujet du ticket',
    example: 'Problème de paiement',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  sujet: string;

  @ApiProperty({
    description: 'Statut du ticket',
    enum: StatutSupportTicket,
    example: StatutSupportTicket.OUVERT,
  })
  @IsEnum(StatutSupportTicket)
  @IsNotEmpty()
  statut: StatutSupportTicket;
}
