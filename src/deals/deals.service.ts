import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deal, DealDocument } from './schemas/deal.schema';
import { Category, CategoryDocument } from './schemas/category.schema';
import { DealDetail, DealDetailDocument } from './schemas/deal-detail.schema';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateDealDetailDto } from './dto/create-deal-detail.dto';
import { UpdateDealDetailDto } from './dto/update-deal-detail.dto';

@Injectable()
export class DealsService {
  constructor(
    @InjectModel(Deal.name) private dealModel: Model<DealDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(DealDetail.name) private dealDetailModel: Model<DealDetailDocument>,
  ) {}

  // Deal methods
  async findAllDeals(): Promise<Deal[]> {
    return this.dealModel.find({ status: 'Active' }).exec();
  }

  async findDealById(id: string): Promise<Deal> {
    const deal = await this.dealModel.findById(id).exec();
    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
    return deal;
  }
  
  async findDealByCode(code: string): Promise<Deal> {
    const deal = await this.dealModel.findOne({ code, status: 'Active' }).exec();
    if (!deal) {
      throw new NotFoundException(`Deal with code ${code} not found`);
    }
    return deal;
  }
  
  async findDealByIdOrCode(idOrCode: string): Promise<Deal> {
    // Try to find by ID first
    try {
      return await this.findDealById(idOrCode);
    } catch (error) {
      // If not found by ID, try to find by code
      try {
        return await this.findDealByCode(idOrCode);
      } catch (innerError) {
        throw new NotFoundException(`Deal with ID or code ${idOrCode} not found`);
      }
    }
  }

  async createDeal(createDealDto: CreateDealDto, createDealDetailDto?: CreateDealDetailDto): Promise<{ deal: Deal; dealDetail?: DealDetail }> {
    // Check if category exists
    const category = await this.categoryModel.findById(createDealDto.categoryId).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${createDealDto.categoryId} not found`);
    }

    // Add category name to the deal
    const dealData = {
      ...createDealDto,
      categoryName: category.name,
    };

    const newDeal = new this.dealModel(dealData);
    const savedDeal = await newDeal.save();
    
    // If deal detail data is provided, create the detail record
    if (createDealDetailDto) {
      const dealDetailData = {
        ...createDealDetailDto,
        dealId: savedDeal._id,
      };
      
      const newDealDetail = new this.dealDetailModel(dealDetailData);
      const savedDealDetail = await newDealDetail.save();
      
      return { deal: savedDeal, dealDetail: savedDealDetail };
    }
    
    return { deal: savedDeal };
  }

  async updateDeal(id: string, updateDealDto: UpdateDealDto): Promise<Deal> {
    // If category ID is updated, check if the new category exists
    if (updateDealDto.categoryId) {
      const category = await this.categoryModel.findById(updateDealDto.categoryId).exec();
      if (!category) {
        throw new NotFoundException(`Category with ID ${updateDealDto.categoryId} not found`);
      }
      // Update category name
      updateDealDto.categoryName = category.name;
    }

    // Check if deal exists
    const deal = await this.dealModel.findById(id).exec();
    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    const updatedDeal = await this.dealModel
      .findByIdAndUpdate(id, updateDealDto, { new: true })
      .exec();
    
    if (!updatedDeal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
    
    return updatedDeal;
  }

  async deleteDeal(id: string): Promise<void> {
    const result = await this.dealModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
  }

  async findDealsByCategory(categoryName: string, page: number = 1, limit: number = 10): Promise<{ deals: Deal[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const query = { categoryName, status: 'Active' };
    const total = await this.dealModel.countDocuments(query).exec();
    const deals = await this.dealModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      deals,
      total,
      page,
      totalPages
    };
  }

  async getRandomDealsByCategories(limit: number = 5): Promise<{ [categoryName: string]: Deal[] }> {
    // Get all active categories - using isActive: true for backward compatibility
    const categories = await this.categoryModel.find({}).exec();
    
    // Object to store deals by category name
    const dealsByCategory: { [categoryName: string]: Deal[] } = {};
    
    // For each category, get random deals
    for (const category of categories) {
      const deals = await this.dealModel.aggregate([
        { $match: { categoryName: category.name, status: 'Active' } },
        { $sample: { size: limit } }
      ]).exec();
      
      dealsByCategory[category.name] = deals;
    }
    
    return dealsByCategory;
  }

  // Category methods
  async findAllCategories(): Promise<any[]> {
    // Using empty query to get all categories
    const categories = await this.categoryModel.find({}).exec();
    
    // Transform the categories to include route_key
    return categories.map(category => {
      const categoryObj = category.toObject();
      return {
        ...categoryObj,
        route_key: encodeURIComponent(category.name)
      };
    });
  }
  
  // Deal Detail methods
  async findDealDetailByDealId(dealId: string): Promise<DealDetail> {
    const dealDetail = await this.dealDetailModel.findOne({ dealId }).exec();
    if (!dealDetail) {
      throw new NotFoundException(`Deal detail for deal ID ${dealId} not found`);
    }
    return dealDetail;
  }
  
  async createDealDetail(createDealDetailDto: CreateDealDetailDto): Promise<DealDetail> {
    // Check if deal exists
    const deal = await this.dealModel.findById(createDealDetailDto.dealId).exec();
    if (!deal) {
      throw new NotFoundException(`Deal with ID ${createDealDetailDto.dealId} not found`);
    }
    
    // Check if detail already exists
    const existingDetail = await this.dealDetailModel.findOne({ dealId: createDealDetailDto.dealId }).exec();
    if (existingDetail) {
      throw new Error(`Deal detail for deal ID ${createDealDetailDto.dealId} already exists`);
    }
    
    const newDealDetail = new this.dealDetailModel(createDealDetailDto);
    return newDealDetail.save();
  }
  
  async updateDealDetail(dealId: string, updateDealDetailDto: UpdateDealDetailDto): Promise<DealDetail> {
    const updatedDealDetail = await this.dealDetailModel
      .findOneAndUpdate({ dealId }, updateDealDetailDto, { new: true })
      .exec();
    
    if (!updatedDealDetail) {
      throw new NotFoundException(`Deal detail for deal ID ${dealId} not found`);
    }
    
    return updatedDealDetail;
  }
  
  async deleteDealDetail(dealId: string): Promise<void> {
    const result = await this.dealDetailModel.deleteOne({ dealId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Deal detail for deal ID ${dealId} not found`);
    }
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    // Update category name in all related deals
    if (updateCategoryDto.name) {
      await this.dealModel.updateMany(
        { categoryId: id },
        { categoryName: updateCategoryDto.name }
      ).exec();
    }
    
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    // Check if there are deals with this category
    const dealsCount = await this.dealModel.countDocuments({ categoryId: id }).exec();
    if (dealsCount > 0) {
      throw new NotFoundException(`Cannot delete category with ID ${id} because it has associated deals`);
    }
    
    const result = await this.categoryModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
