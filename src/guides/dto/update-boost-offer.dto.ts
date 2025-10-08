import { PartialType } from '@nestjs/swagger';
import { CreateBoostOfferDto } from './create-boost-offer.dto';

export class UpdateBoostOfferDto extends PartialType(CreateBoostOfferDto) {}
