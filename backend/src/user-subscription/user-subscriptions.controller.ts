import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { UserSubscriptionsService } from './user-subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-subscriptions')
@UseGuards(JwtAuthGuard)
export class UserSubscriptionsController {
  constructor(private readonly userSubscriptionsService: UserSubscriptionsService) {}

  @Get()
  async findAll() {
    return this.userSubscriptionsService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.userSubscriptionsService.findByUser(userId);
  }

  @Get('active')
  async findActive() {
    return this.userSubscriptionsService.findActive();
  }

  @Get('expired')
  async findExpired() {
    return this.userSubscriptionsService.findExpired();
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    return this.userSubscriptionsService.findByStatus(status);
  }

  @Get('stats')
  async getStats() {
    return this.userSubscriptionsService.getStats();
  }

  @Post()
  async create(@Body() subscriptionData: any) {
    return this.userSubscriptionsService.create(subscriptionData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() subscriptionData: Partial<any>) {
    return this.userSubscriptionsService.update(id, subscriptionData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userSubscriptionsService.remove(id);
  }
}