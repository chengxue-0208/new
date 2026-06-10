import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { User, Node, Order, SubscriptionPlan, ConnectionLog, SystemLog } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Node, Order, SubscriptionPlan, ConnectionLog, SystemLog])],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}