import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, User } from '../order/order.entity';
import { SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, SubscriptionPlan])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrderModule {}
