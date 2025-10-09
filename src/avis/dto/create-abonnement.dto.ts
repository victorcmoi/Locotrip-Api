import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsDateString } from 'class-validator';
import { TypeAbonnement } from '../../guides/enums/guide-availability.enum';

export class CreateAbonnementDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  utilisateur_id: string;

  @ApiProperty({
    description: 'Type d\'abonnement',
    enum: TypeAbonnement,
    example: TypeAbonnement.LOCO_PLUS,
  })
  @IsNotEmpty()
  @IsEnum(TypeAbonnement)
  type_abonnement: TypeAbonnement;

  @ApiProperty({
    description: 'Date de début de l\'abonnement',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date_debut: Date;

  @ApiProperty({
    description: 'Date de fin de l\'abonnement',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date_fin: Date;

  @ApiProperty({
    description: 'Statut de l\'abonnement',
    example: 'actif',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  statut: string;
}
