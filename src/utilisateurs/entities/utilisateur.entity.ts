import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUtilisateurDto } from '../dto/create-utilisateur.dto';

export class UtilisateurEntity extends OmitType(CreateUtilisateurDto, ['mot_de_passe'] as const) {
  @ApiProperty({
    description: 'Identifiant unique de l\'utilisateur',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Date de création du compte',
    example: '2025-01-15T10:30:00.000Z',
  })
  date_creation: Date;
}
