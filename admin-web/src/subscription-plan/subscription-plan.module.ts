import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionPlan } from './subscription-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan])],
  providers: [SubscriptionPlanService],
  exports: [SubscriptionPlanService],
})
export class SubscriptionPlanModule {}