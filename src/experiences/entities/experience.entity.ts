import { ApiProperty } from '@nestjs/swagger';
import { CreateExperienceDto } from '../dto/create-experience.dto';

export class ExperienceEntity extends CreateExperienceDto {
  @ApiProperty({
    description: 'ID unique de l\'expérience',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;
}
