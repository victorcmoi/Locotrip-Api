import { ApiProperty } from '@nestjs/swagger';
import { CreateGuideDto } from '../dto/create-guide.dto';

export class GuideEntity extends CreateGuideDto {
  @ApiProperty({
    description: 'ID unique du guide',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Date de demande de carte professionnelle',
    example: '2025-01-15T10:30:00.000Z',
    required: false,
  })
  card_request_date?: Date;

  @ApiProperty({
    description: 'Date de vérification de la carte professionnelle',
    example: '2025-01-20T14:00:00.000Z',
    required: false,
  })
  card_verification_date?: Date;

  @ApiProperty({
    description: 'Date de création du profil guide',
    example: '2025-01-10T09:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
    example: '2025-01-22T16:45:00.000Z',
  })
  updated_at: Date;
}
