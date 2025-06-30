import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('admin')
@UseGuards(RoleGuard)
@SetMetadata('role', ['admin'])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return await this.adminService.getDashboardStats();
  }

  @Get('orders/stats')
  async getOrderStats() {
    return await this.adminService.getOrderStats();
  }

  @Get('revenue/stats')
  async getRevenueStats(days?: number) {
    return await this.adminService.getRevenueStats(days);
  }
}
