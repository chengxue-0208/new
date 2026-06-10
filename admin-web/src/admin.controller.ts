import { Controller, Get, Post, Put, Delete, Query, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { Order, User, Node, SubscriptionPlan } from './entities';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  async getUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getUsers(page, limit);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Get('nodes')
  async getNodes() {
    return this.adminService.getNodes();
  }

  @Post('nodes')
  async createNode(@Body() nodeData: Node) {
    return this.adminService.createNode(nodeData);
  }

  @Put('nodes/:id')
  async updateNode(@Param('id') id: string, @Body() nodeData: any) {
    return this.adminService.updateNode(id, nodeData);
  }

  @Delete('nodes/:id')
  async deleteNode(@Param('id') id: string) {
    return this.adminService.deleteNode(id);
  }

  @Get('orders')
  async getOrders(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getOrders(page, limit);
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.adminService.getOrder(id);
  }

  @Get('logs')
  async getLogs(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.adminService.getLogs(page, limit);
  }

  @Delete('logs/:id')
  async deleteLog(@Param('id') id: string) {
    return this.adminService.deleteLog(id);
  }

  @Get('subscription-plans')
  async getSubscriptionPlans() {
    return this.adminService.getSubscriptionPlans();
  }

  @Post('subscription-plans')
  async createSubscriptionPlan(@Body() planData: SubscriptionPlan) {
    return this.adminService.createSubscriptionPlan(planData);
  }

  @Put('subscription-plans/:id')
  async updateSubscriptionPlan(@Param('id') id: string, @Body() planData: any) {
    return this.adminService.updateSubscriptionPlan(id, planData);
  }

  @Delete('subscription-plans/:id')
  async deleteSubscriptionPlan(@Param('id') id: string) {
    return this.adminService.deleteSubscriptionPlan(id);
  }
}