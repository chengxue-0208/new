import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { Order } from '../entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SubscriptionPlan, Order])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}