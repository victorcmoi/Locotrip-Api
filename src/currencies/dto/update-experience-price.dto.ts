import { PartialType } from '@nestjs/swagger';
import { CreateExperiencePriceDto } from './create-experience-price.dto';

export class UpdateExperiencePriceDto extends PartialType(CreateExperiencePriceDto) {}
