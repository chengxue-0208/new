import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';
import { Node } from '../node/node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Node])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
