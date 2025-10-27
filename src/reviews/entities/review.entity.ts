import { ApiProperty } from '@nestjs/swagger';
import { CreateReviewDto } from '../dto/create-review.dto';

export class ReviewEntity extends CreateReviewDto {
  @ApiProperty({
    description: 'ID unique de l\'avis',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Date de création de l\'avis',
    example: '2025-01-20T15:30:00.000Z',
  })
  review_date: Date;
}
