import { ApiProperty } from '@nestjs/swagger';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingStatus } from '../enums/booking.enum';

export class BookingEntity extends CreateBookingDto {
  @ApiProperty({
    description: 'ID unique de la réservation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Statut de la réservation',
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;
}
