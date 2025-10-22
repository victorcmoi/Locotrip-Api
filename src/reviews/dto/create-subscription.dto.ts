import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsDateString } from 'class-validator';
import { SubscriptionType } from '../../guides/enums/guide-availability.enum';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'ID de l\'user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({
    description: 'Type d\'subscription',
    enum: SubscriptionType,
    example: SubscriptionType.LOCO_PLUS,
  })
  @IsNotEmpty()
  @IsEnum(SubscriptionType)
  subscription_type: SubscriptionType;

  @ApiProperty({
    description: 'Date de début de l\'subscription',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty({
    description: 'Date de fin de l\'subscription',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  end_date: Date;

  @ApiProperty({
    description: 'Statut de l\'subscription',
    example: 'actif',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  status: string;
}
