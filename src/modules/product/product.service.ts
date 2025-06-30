import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const categoryId = await this.prisma.category.findFirst({
      where: { id: dto.categoryId },
    });

    if (!categoryId) throw new ConflictException('CategoryId not fount');

    const subCategoryId = await this.prisma.subCategory.findFirst({
      where: { id: dto.subCategoryId },
    });

    if (!subCategoryId) throw new ConflictException('SubCategoryId not fount');

    return this.prisma.product.create({
      data: dto,
      include: {
        category: true,
        subCategory: true,
      },
    });
  }

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 10, search, categoryId, subCategoryId } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (subCategoryId) {
      where.subCategoryId = subCategoryId;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          subCategory: true,
          reviews: {
            where: { isDeleted: false },
            select: { rating: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const productsWithRating = products.map((product) => ({
      ...product,
      averageRating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0,
      reviewCount: product.reviews.length,
    }));

    return {
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: {
        category: true,
        subCategory: true,
        reviews: {
          where: { isDeleted: false },
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const averageRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        : 0;

    return {
      ...product,
      averageRating,
      reviewCount: product.reviews.length,
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findFirst({
      where: { id, isDeleted: false },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        category: true,
        subCategory: true,
      },
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, isDeleted: false },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
