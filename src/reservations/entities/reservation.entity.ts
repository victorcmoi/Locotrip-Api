import { ApiProperty } from '@nestjs/swagger';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { StatutReservation } from '../../../prisma/enums';

export class ReservationEntity extends CreateReservationDto {
  @ApiProperty({
    description: 'ID unique de la réservation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Statut de la réservation',
    enum: StatutReservation,
    example: StatutReservation.CONFIRMEE,
  })
  statut: StatutReservation;
}
