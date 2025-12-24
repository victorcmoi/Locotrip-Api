import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { BookingStatus } from '../enums/booking.enum';

export class FindAllBookingsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: "ID de l'utilisateur",
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: "ID de l'expérience",
  })
  @IsUUID()
  @IsOptional()
  experienceId?: string;

  @ApiPropertyOptional({
    description: 'Statut de la réservation',
    enum: BookingStatus,
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({
    description: 'Date de début (format ISO)',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Date de fin (format ISO)',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
