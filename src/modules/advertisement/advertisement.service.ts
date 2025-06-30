import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import {
  CreateAdvertisementDto,
  UpdateAdvertisementDto,
  AdvertisementQueryDto,
} from './dto';

@Injectable()
export class AdvertisementService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdvertisementDto) {
    return await this.prisma.advertisement.create({
      data: {
        title: dto.title,
        content: dto.content,
        videoUrl: dto.videoUrl,
        imageUrl: dto.imageUrl,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: dto.isActive,
      },
    });
  }

  async findAll(query: AdvertisementQueryDto) {
    const { page = 1, limit = 10, isActive } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isActive) {
      const now = new Date();
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    }

    const [advertisements, total] = await Promise.all([
      this.prisma.advertisement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.advertisement.count({ where }),
    ]);

    return {
      advertisements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const advertisement = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!advertisement) {
      throw new NotFoundException('Advertisement not found');
    }

    return advertisement;
  }

  async update(id: string, dto: UpdateAdvertisementDto) {
    const advertisement = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!advertisement) {
      throw new NotFoundException('Advertisement not found');
    }

    return this.prisma.advertisement.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const advertisement = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!advertisement) {
      throw new NotFoundException('Advertisement not found');
    }

    return this.prisma.advertisement.delete({
      where: { id },
    });
  }

  async incrementView(id: string) {
    return this.prisma.advertisement.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  async incrementClick(id: string) {
    return this.prisma.advertisement.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  }

  async getActiveAds() {
    const now = new Date();
    return this.prisma.advertisement.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
