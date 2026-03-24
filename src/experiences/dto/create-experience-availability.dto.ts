import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { AvailabilityStatus } from '../../guides/enums/guide-availability.enum';

export class CreateExperienceAvailabilityDto {
    @ApiProperty({
        description: "ID de l'expérience",
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID()
    @IsNotEmpty()
    experience_id: string;

    @ApiProperty({
        description: 'Date de début de disponibilité',
        example: '2026-02-01T09:00:00.000Z',
    })
    @IsDateString()
    @IsNotEmpty()
    start_date: Date;

    @ApiProperty({
        description: 'Date de fin de disponibilité',
        example: '2026-02-28T18:00:00.000Z',
    })
    @IsDateString()
    @IsNotEmpty()
    end_date: Date;

    @ApiProperty({
        description: 'Statut de disponibilité',
        enum: AvailabilityStatus,
        example: AvailabilityStatus.AVAILABLE,
    })
    @IsEnum(AvailabilityStatus)
    @IsNotEmpty()
    status: AvailabilityStatus;
}
