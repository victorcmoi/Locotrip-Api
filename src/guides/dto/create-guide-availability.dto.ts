import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { StatutDisponibilite } from '../enums/guide-availability.enum';

export class CreateGuideAvailabilityDto {
  @ApiProperty({
    description: 'ID du guide',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  guide_id: string;

  @ApiProperty({
    description: 'Date de début de disponibilité',
    example: '2025-02-01T09:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date_debut: Date;

  @ApiProperty({
    description: 'Date de fin de disponibilité',
    example: '2025-02-28T18:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date_fin: Date;

  @ApiProperty({
    description: 'Statut de disponibilité',
    enum: StatutDisponibilite,
    example: StatutDisponibilite.DISPONIBLE,
  })
  @IsEnum(StatutDisponibilite)
  @IsNotEmpty()
  statut: StatutDisponibilite;
}
