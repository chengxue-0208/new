import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, Node, Order, SubscriptionPlan, ConnectionLog, SystemLog } from './entities';
import { UsersModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { SubscriptionPlanModule } from './subscription-plan/subscription-plan.module';
import { StatsModule } from './stats/stats.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forFeature([
      User, Node, Order, SubscriptionPlan, ConnectionLog, SystemLog,
    ]),
    UsersModule,
    OrderModule,
    SubscriptionPlanModule,
    StatsModule,
    LogModule,
    ConfigModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}