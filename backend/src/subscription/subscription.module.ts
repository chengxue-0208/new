import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { User, SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
import { UserSubscription } from '../user-subscription/user-subscription.entity';
import { Node } from '../node/node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SubscriptionPlan, UserSubscription, Node])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
