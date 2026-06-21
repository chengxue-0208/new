import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { User, SubscriptionPlan, UserSubscription } from '../subscription-plan/subscription-plan.entity';
import { Node } from '../node/node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SubscriptionPlan, Node])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
