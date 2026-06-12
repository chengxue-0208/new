import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
import { Order } from '../order/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SubscriptionPlan, Order])],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}