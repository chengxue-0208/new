import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { User, SubscriptionPlan, UserSubscription } from '../subscription-plan/subscription-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SubscriptionPlan])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}