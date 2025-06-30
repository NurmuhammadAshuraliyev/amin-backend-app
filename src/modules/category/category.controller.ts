import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Body,
  SetMetadata,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @Post('subcategories')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return await this.categoryService.createSubCategory(createSubCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAllCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOneCategory(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Patch('subcategories/:id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async updateSubCategory(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return await this.categoryService.updateSubCategory(
      id,
      updateSubCategoryDto,
    );
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async removeCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }

  @Delete('subcategories/:id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async removeSubCategory(@Param('id') id: string) {
    return await this.categoryService.deleteSubCategory(id);
  }
}
