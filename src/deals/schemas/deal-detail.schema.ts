import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Deal } from './deal.schema';

export type DealDetailDocument = DealDetail & Document;

@Schema()
export class DealDetail {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Deal', required: true })
  dealId: string;

  @Prop({ required: true })
  businessModel: string;

  @Prop({ required: true })
  revenueSource: string;

  @Prop({ type: Number, default: null })
  expectedApyMinPct: number | null;

  @Prop({ type: Number, default: null })
  expectedApyMaxPct: number | null;

  @Prop()
  capitalGainsBasis: string;

  @Prop()
  investmentValueNote: string;

  @Prop()
  yieldDistributionFormat: string;

  @Prop()
  minimumInvestment: string;

  @Prop()
  liquidityNote: string;

  @Prop({ type: String, default: null })
  otherDetails: string | null;

  @Prop()
  detailsOfAsset: string;

  @Prop({ type: Number })
  avgLoanToValuePct: number;

  @Prop({ type: Date })
  expectedPossessionDate: Date;

  @Prop({ type: Number })
  fundTermYears: number;

  @Prop({ type: Date })
  lastThirdPartyValuation: Date;
}

export const DealDetailSchema = SchemaFactory.createForClass(DealDetail);
