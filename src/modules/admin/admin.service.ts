import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalReviews,
      pendingOrders,
      totalRevenue,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      this.prisma.product.count({ where: { isDeleted: false } }),
      this.prisma.order.count(),
      this.prisma.user.count(),
      this.prisma.review.count({ where: { isDeleted: false } }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'DELIVERED' },
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { fullName: true } },
          orderItems: {
            include: {
              product: { select: { name: true } },
            },
          },
        },
      }),
      this.prisma.product.findMany({
        take: 5,
        where: { isDeleted: false },
        orderBy: { soldCount: 'desc' },
        select: {
          id: true,
          name: true,
          soldCount: true,
          price: true,
          images: true,
        },
      }),
    ]);

    return {
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalReviews,
        pendingOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
      },
      recentOrders,
      topProducts,
    };
  }

  async getOrderStats() {
    const orderStats = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return orderStats.map((stat) => ({
      status: stat.status,
      count: stat._count.status,
    }));
  }

  async getRevenueStats(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const revenueData = await this.prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    });

    const dailyRevenue = revenueData.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + Number(order.totalAmount);
      return acc;
    }, {});

    return Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }
}
