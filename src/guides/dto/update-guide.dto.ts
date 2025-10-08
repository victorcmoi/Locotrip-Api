import { PartialType } from '@nestjs/swagger';
import { CreateGuideDto } from './create-guide.dto';

/**
 * DTO pour la mise à jour d'un guide.
 * Tous les champs sont optionnels.
 */
export class UpdateGuideDto extends PartialType(CreateGuideDto) {}
