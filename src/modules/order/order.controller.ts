import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderQueryDto } from './dto';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['user'])
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return await this.orderService.create(req['userId'], createOrderDto);
  }

  @Get()
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async findAll(@Query() query: OrderQueryDto) {
    return await this.orderService.findAll(query);
  }

  @Get('my-orders')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['user'])
  async getUserOrders(@Query() query: OrderQueryDto, @Req() req: Request) {
    return await this.orderService.getUserOrders(req['userId'], query);
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['user'])
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return await this.orderService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req: Request,
  ) {
    return await this.orderService.updateStatus(id, updateOrderStatusDto);
  }
}
