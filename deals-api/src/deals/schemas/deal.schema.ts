import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from './category.schema';

export type DealDocument = Deal & Document;

@Schema({ timestamps: true })
export class Deal {
  @Prop({ required: true, maxlength: 120 })
  title: string;

  @Prop({ required: true, unique: true, maxlength: 16 })
  code: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  categoryId: string;

  @Prop()
  categoryName: string;

  @Prop({ required: true, maxlength: 120 })
  assetType: string;

  @Prop({ required: true, maxlength: 120 })
  yieldSource: string;

  @Prop({ type: Number, default: null })
  expectedRevenueMinPct: number | null;

  @Prop({ type: Number, default: null })
  expectedRevenueMaxPct: number | null;

  @Prop({ type: Number, default: null })
  expectedIrrMinPct: number | null;

  @Prop({ type: Number, default: null })
  expectedIrrMaxPct: number | null;

  @Prop({ required: true, type: Number, default: null })
  minimumInvestmentUsd: number | null;

  @Prop({ type: Number, default: null })
  totalAssetValueUsd: number | null;

  @Prop({ maxlength: 120 })
  geography: string;

  @Prop()
  qualificationCriteria: string;

  @Prop({ default: 'Active', maxlength: 40 })
  status: string;

  @Prop()
  imageUrl: string;

  @Prop()
  tags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DealSchema = SchemaFactory.createForClass(Deal);

// Create an index on categoryId for efficient querying
DealSchema.index({ categoryId: 1 });
