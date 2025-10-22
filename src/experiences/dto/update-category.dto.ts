import { PartialType } from '@nestjs/swagger';
import { CreateCategorieDto } from './create-category.dto';

export class UpdateCategorieDto extends PartialType(CreateCategorieDto) {}
