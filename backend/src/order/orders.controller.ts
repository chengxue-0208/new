import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    const result = await this.ordersService.findAll(page, limit, search, status);
    return { data: result };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUser(userId);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    return this.ordersService.findByStatus(status);
  }

  @Post()
  async create(@Body() orderData: any) {
    return this.ordersService.create(orderData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() orderData: Partial<any>) {
    return this.ordersService.update(id, orderData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
