import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('api')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  // Deal endpoints
  @Get('deals')
  findAllDeals() {
    return this.dealsService.findAllDeals();
  }

  @Get('deals/:id')
  findDealById(@Param('id') id: string) {
    return this.dealsService.findDealById(id);
  }
  
  @Get('deal-details/:idOrCode')
  async findDealDetailByIdOrCode(@Param('idOrCode') idOrCode: string) {
    try {
      // First find the deal by ID or code
      const deal = await this.dealsService.findDealByIdOrCode(idOrCode);
      // Then find the deal details using the deal's ID
      // Use idOrCode directly if it's a valid MongoDB ID, otherwise use the deal's ID from MongoDB
      const dealId = deal['_id'] ? deal['_id'].toString() : idOrCode;
      const dealDetail = await this.dealsService.findDealDetailByDealId(dealId);
      // Return both the deal and its details
      return { deal, dealDetail };
    } catch (error) {
      throw error;
    }
  }

  @Post('deals')
  createDeal(@Body() createDealDto: CreateDealDto) {
    return this.dealsService.createDeal(createDealDto);
  }

  @Patch('deals/:id')
  updateDeal(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealsService.updateDeal(id, updateDealDto);
  }

  @Delete('deals/:id')
  deleteDeal(@Param('id') id: string) {
    return this.dealsService.deleteDeal(id);
  }

  @Get('deals/category/:categoryName')
  findDealsByCategory(
    @Param('categoryName') categoryName: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.dealsService.findDealsByCategory(categoryName, page, limit);
  }

  @Get('deals-by-categories')
  async getDealsByCategories(@Query('limit') limit: number = 5) {
    // If no specific category is requested, return random deals from each category
    return this.dealsService.getRandomDealsByCategories(limit);
  }

  // Category endpoints
  @Get('categories')
  findAllCategories() {
    return this.dealsService.findAllCategories();
  }
  
  @Get('categories-with-route-keys')
  async getCategoriesWithRouteKeys() {
    return this.dealsService.findAllCategories();
  }

  @Get('categories/:id')
  findCategoryById(@Param('id') id: string) {
    return this.dealsService.findCategoryById(id);
  }

  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.dealsService.createCategory(createCategoryDto);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.dealsService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.dealsService.deleteCategory(id);
  }
}
