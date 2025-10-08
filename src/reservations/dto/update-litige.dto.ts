import { PartialType } from '@nestjs/swagger';
import { CreateLitigeDto } from './create-litige.dto';

export class UpdateLitigeDto extends PartialType(CreateLitigeDto) {}
