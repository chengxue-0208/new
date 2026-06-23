import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, User, SubscriptionPlan } from '../order/order.entity';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Order, User, SubscriptionPlan]), SubscriptionModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
