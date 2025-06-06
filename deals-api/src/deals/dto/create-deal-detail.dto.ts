import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDealDetailDto {
  @IsNotEmpty()
  @IsString()
  dealId: string;

  @IsNotEmpty()
  @IsString()
  businessModel: string;

  @IsNotEmpty()
  @IsString()
  revenueSource: string;

  @IsOptional()
  @IsNumber()
  expectedApyMinPct?: number;

  @IsOptional()
  @IsNumber()
  expectedApyMaxPct?: number;

  @IsOptional()
  @IsString()
  capitalGainsBasis?: string;

  @IsOptional()
  @IsString()
  investmentValueNote?: string;

  @IsOptional()
  @IsString()
  yieldDistributionFormat?: string;

  @IsOptional()
  @IsString()
  liquidityNote?: string;

  @IsOptional()
  @IsString()
  otherDetails?: string;

  @IsOptional()
  @IsString()
  detailsOfAsset?: string;

  @IsOptional()
  @IsNumber()
  avgLoanToValuePct?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expectedPossessionDate?: Date;

  @IsOptional()
  @IsNumber()
  fundTermYears?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastThirdPartyValuation?: Date;
}
