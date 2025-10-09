import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { StatutBoost } from '../enums/guide-boost.enum';

export class CreateGuideBoostDto {
  @ApiProperty({
    description: 'ID du guide',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  guide_id: string;

  @ApiProperty({
    description: 'ID de l\'offre de boost',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsNotEmpty()
  boost_offer_id: string;

  @ApiProperty({
    description: 'Date d\'expiration du boost',
    example: '2025-03-01T23:59:59.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date_expiration: Date;

  @ApiProperty({
    description: 'Statut du boost',
    enum: StatutBoost,
    example: StatutBoost.ACTIVE,
  })
  @IsEnum(StatutBoost)
  @IsNotEmpty()
  statut: StatutBoost;
}
