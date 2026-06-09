import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  async getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMySubscription(@Request() req: any) {
    return this.subscriptionService.getMySubscription(req.user.id);
  }

  @Post('purchase')
  @UseGuards(JwtAuthGuard)
  async purchase(@Body() purchaseData: any, @Request() req: any) {
    return this.subscriptionService.purchase(purchaseData, req.user.id);
  }
}