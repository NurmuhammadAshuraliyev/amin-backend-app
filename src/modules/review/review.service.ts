import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewQueryDto,
  RespondToReviewDto,
} from './dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, isDeleted: false },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const findUserId = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!findUserId) throw new ConflictException('User id not fount');

    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        productId: dto.productId,
        isDeleted: false,
      },
    });

    if (existingReview) {
      throw new ForbiddenException('You have already reviewed this product');
    }

    return this.prisma.review.create({
      data: {
        userId,
        productId: dto.productId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: {
          select: { fullName: true },
        },
        product: {
          select: { name: true },
        },
      },
    });
  }

  async findAll(query: ReviewQueryDto) {
    const { page = 1, limit = 10, productId } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      isDeleted: false,
    };

    if (productId) {
      where.productId = productId;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { fullName: true },
          },
          product: {
            select: { name: true, images: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: {
          select: { fullName: true, phone: true },
        },
        product: {
          select: { name: true, images: true },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findFirst({
      where: { id, isDeleted: false },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    return this.prisma.review.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: { fullName: true },
        },
        product: {
          select: { name: true },
        },
      },
    });
  }

  async respondToReview(id: string, dto: RespondToReviewDto) {
    const review = await this.prisma.review.findFirst({
      where: { id, isDeleted: false },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.update({
      where: { id },
      data: { response: dto.response },
      include: {
        user: {
          select: { fullName: true },
        },
        product: {
          select: { name: true },
        },
      },
    });
  }

  async remove(id: string, userId?: string) {
    const review = await this.prisma.review.findFirst({
      where: { id, isDeleted: false },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (userId && review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    return this.prisma.review.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async getUserReviews(userId: string, query: ReviewQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        skip,
        take: limit,
        include: {
          product: {
            select: { name: true, images: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({
        where: {
          userId,
          isDeleted: false,
        },
      }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
