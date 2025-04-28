import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsArray, Min, IsEnum } from 'class-validator';

export class CreateDealDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  categoryName?: string;

  @IsNotEmpty()
  @IsString()
  assetType: string;

  @IsNotEmpty()
  @IsString()
  yieldSource: string;

  @IsOptional()
  @IsNumber()
  expectedRevenueMinPct?: number;

  @IsOptional()
  @IsNumber()
  expectedRevenueMaxPct?: number;

  @IsOptional()
  @IsNumber()
  expectedIrrMinPct?: number;

  @IsOptional()
  @IsNumber()
  expectedIrrMaxPct?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minimumInvestmentUsd: number;

  @IsOptional()
  @IsNumber()
  totalAssetValueUsd?: number;

  @IsOptional()
  @IsString()
  geography?: string;

  @IsOptional()
  @IsString()
  qualificationCriteria?: string;

  @IsOptional()
  @IsString()
  status?: string = 'Active';

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
