import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'ID de la conversation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  conversation_id: string;

  @ApiProperty({
    description: 'ID de l\'author du message',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsNotEmpty()
  author_id: string;

  @ApiProperty({
    description: 'Contenu du message',
    example: 'Bonjour, je souhaiterais des informations sur cette expérience.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
