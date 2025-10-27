import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';

export class UserEntity extends OmitType(CreateUserDto, ['password'] as const) {
  @ApiProperty({
    description: 'Identifiant unique de l\'utilisateur',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Date de création du compte',
    example: '2025-01-15T10:30:00.000Z',
  })
  created_at: Date;
}
