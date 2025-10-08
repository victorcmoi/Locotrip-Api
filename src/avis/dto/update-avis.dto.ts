import { PartialType } from '@nestjs/swagger';
import { CreateAvisDto } from './create-avis.dto';

export class UpdateAvisDto extends PartialType(CreateAvisDto) {}
