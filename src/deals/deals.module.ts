import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { Deal, DealSchema } from './schemas/deal.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { DealDetail, DealDetailSchema } from './schemas/deal-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deal.name, schema: DealSchema },
      { name: Category.name, schema: CategorySchema },
      { name: DealDetail.name, schema: DealDetailSchema },
    ]),
  ],
  controllers: [DealsController],
  providers: [DealsService]
})
export class DealsModule {}
