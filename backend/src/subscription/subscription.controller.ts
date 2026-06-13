import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  async getPlans() {
    const data = await this.subscriptionService.getPlans();
    return { data };
  }

  @Post('plans')
  @UseGuards(JwtAuthGuard)
  async createPlan(@Body() planData: any) {
    return this.subscriptionService.createPlan(planData);
  }

  @Put('plans/:id')
  @UseGuards(JwtAuthGuard)
  async updatePlan(@Param('id') id: string, @Body() planData: any) {
    return this.subscriptionService.updatePlan(id, planData);
  }

  @Delete('plans/:id')
  @UseGuards(JwtAuthGuard)
  async deletePlan(@Param('id') id: string) {
    return this.subscriptionService.deletePlan(id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMySubscription(@Request() req: any) {
    return this.subscriptionService.getMySubscription(req.user.userId);
  }

  @Post('purchase')
  @UseGuards(JwtAuthGuard)
  async purchase(@Body() purchaseData: any, @Request() req: any) {
    return this.subscriptionService.purchase(purchaseData, req.user.userId);
  }
}
