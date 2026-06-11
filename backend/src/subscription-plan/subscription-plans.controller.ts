import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscription-plans')
@UseGuards(JwtAuthGuard)
export class SubscriptionPlansController {
  constructor(private readonly subscriptionPlansService: SubscriptionPlansService) {}

  @Get()
  async findAll() {
    return this.subscriptionPlansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.subscriptionPlansService.findOne(id);
  }

  @Post()
  async create(@Body() planData: any) {
    return this.subscriptionPlansService.create(planData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() planData: Partial<any>) {
    return this.subscriptionPlansService.update(id, planData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.subscriptionPlansService.remove(id);
  }
}