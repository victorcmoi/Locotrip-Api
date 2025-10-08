import { PartialType } from '@nestjs/swagger';
import { CreateExperiencePrixDto } from './create-experience-prix.dto';

export class UpdateExperiencePrixDto extends PartialType(CreateExperiencePrixDto) {}
