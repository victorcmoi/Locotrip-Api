import { ApiProperty } from '@nestjs/swagger';
import { CreateAvisDto } from '../dto/create-avis.dto';

export class AvisEntity extends CreateAvisDto {
  @ApiProperty({
    description: 'ID unique de l\'avis',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Date de création de l\'avis',
    example: '2025-01-20T15:30:00.000Z',
  })
  date_avis: Date;
}
