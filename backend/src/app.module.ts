import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { NodeModule } from './node/node.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SubscriptionPlanModule } from './subscription-plan/subscription-plan.module';
import { OrderModule } from './order/order.module';
import { VpnModule } from './vpn/vpn.module';
import { CommonModule } from './common/common.module';
import { PaymentModule } from './payment/payment.module';
import { VpnConfigModule } from './vpn-config/vpn-config.module';
import { SystemLogModule } from './system-log/system-log.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    NodeModule,
    SubscriptionModule,
    SubscriptionPlanModule,
    OrderModule,
    VpnModule,
    PaymentModule,
    VpnConfigModule,
    SystemLogModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
