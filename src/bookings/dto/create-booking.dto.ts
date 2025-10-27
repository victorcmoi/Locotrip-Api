import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsInt, IsDecimal, IsDateString, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur qui réserve',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'ID de l\'expérience réservée',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsNotEmpty()
  experience_id: string;

  @ApiProperty({
    description: 'Date et heure de la réservation',
    example: '2025-02-15T14:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  booking_date: Date;

  @ApiProperty({
    description: 'Nombre de participants',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  number_of_participants: number;

  @ApiProperty({
    description: 'Prix total de la réservation',
    example: 90.00,
  })
  @IsDecimal()
  @IsNotEmpty()
  total_price: number;
}
