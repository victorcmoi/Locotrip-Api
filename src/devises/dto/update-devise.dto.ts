import { PartialType } from '@nestjs/swagger';
import { CreateDeviseDto } from './create-devise.dto';

export class UpdateDeviseDto extends PartialType(CreateDeviseDto) {}
