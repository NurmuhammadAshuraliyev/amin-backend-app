import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  async createSubCategory(dto: CreateSubCategoryDto) {
    const cotegoreId = await this.prisma.category.findFirst({
      where: { id: dto.categoryId },
    });

    if (!cotegoreId) throw new ConflictException('cotegore id not found');

    return this.prisma.subCategory.create({
      data: dto,
      include: {
        category: true,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      where: { isDeleted: false },
      include: {
        subCategories: {
          where: { isDeleted: false },
        },
        _count: {
          select: {
            products: {
              where: { isDeleted: false },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneCategory(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, isDeleted: false },
      include: {
        subCategories: {
          where: { isDeleted: false },
        },
        products: {
          where: { isDeleted: false },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: { id, isDeleted: false },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async updateSubCategory(id: string, dto: UpdateSubCategoryDto) {
    const subCategory = await this.prisma.subCategory.findFirst({
      where: { id, isDeleted: false },
    });

    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }

    return this.prisma.subCategory.update({
      where: { id },
      data: dto,
      include: {
        category: true,
      },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, isDeleted: false },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Soft delete category va uning subcategories
    await this.prisma.$transaction([
      this.prisma.category.update({
        where: { id },
        data: { isDeleted: true },
      }),
      this.prisma.subCategory.updateMany({
        where: { categoryId: id },
        data: { isDeleted: true },
      }),
      this.prisma.product.updateMany({
        where: { categoryId: id },
        data: { isDeleted: true },
      }),
    ]);

    return { message: 'Category deleted successfully' };
  }

  async deleteSubCategory(id: string) {
    const subCategory = await this.prisma.subCategory.findFirst({
      where: { id, isDeleted: false },
    });

    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }

    await this.prisma.$transaction([
      this.prisma.subCategory.update({
        where: { id },
        data: { isDeleted: true },
      }),
      this.prisma.product.updateMany({
        where: { subCategoryId: id },
        data: { isDeleted: true },
      }),
    ]);

    return { message: 'SubCategory deleted successfully' };
  }
}
