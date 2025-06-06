import { PartialType } from '@nestjs/mapped-types';
import { CreateDealDetailDto } from './create-deal-detail.dto';

export class UpdateDealDetailDto extends PartialType(CreateDealDetailDto) {}
