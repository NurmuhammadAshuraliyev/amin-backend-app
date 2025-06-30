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
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    return await this.productService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
}
