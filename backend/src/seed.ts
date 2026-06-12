import { DataSource } from 'typeorm';
import { SubscriptionPlan } from './subscription-plan/subscription-plan.entity';
import { User } from './user/user.entity';
import { Node } from './node/node.entity';
import { VPNConfiguration } from './vpn/vpn-configuration.entity';
import { Order, OrderStatus, OrderPaymentMethod } from './order/order.entity';
import { UserSubscription } from './user-subscription/user-subscription.entity';
import { ConnectionLog } from './connection-log/connection-log.entity';
import { SystemLog, LogSource, LogLevel } from './system-log/system-log.entity';
import { SubscriptionStatus } from './user-subscription/user-subscription.entity';

export async function runSeed(dataSource: DataSource): Promise<void> {
  const subscriptionPlanRepository = dataSource.getRepository(SubscriptionPlan);
  const userRepository = dataSource.getRepository(User);
  const nodeRepository = dataSource.getRepository(Node);
  const vpnConfigRepository = dataSource.getRepository(VPNConfiguration);
  const orderRepository = dataSource.getRepository(Order);
  const userSubscriptionRepository = dataSource.getRepository(UserSubscription);
  const connectionLogRepository = dataSource.getRepository(ConnectionLog);
  const systemLogRepository = dataSource.getRepository(SystemLog);

  console.log('Starting database seed...');

  try {
    const hasData = await checkIfDataExists(dataSource);

    if (hasData) {
      console.log('Database already has data, skipping seed.');
      return;
    }

    await subscriptionPlanRepository.save([
      {
        name: 'Monthly Plan',
        price: 19.99,
        durationDays: 30,
        monthlyTraffic: 100,
        isActive: true,
        displayOrder: 1
      },
      {
        name: '3-Month Plan',
        price: 49.99,
        durationDays: 90,
        monthlyTraffic: 200,
        isActive: true,
        displayOrder: 2
      },
      {
        name: '6-Month Plan',
        price: 79.99,
        durationDays: 180,
        monthlyTraffic: 300,
        isActive: true,
        displayOrder: 3
      },
      {
        name: '1-Year Plan',
        price: 149.99,
        durationDays: 365,
        monthlyTraffic: 500,
        isActive: true,
        displayOrder: 4
      }
    ]);

    await userRepository.save([
      {
        email: 'admin@example.com',
        passwordHash: 'hashed_password_for_admin',
        subscriptionStatus: 'ACTIVE',
        subscriptionPlanId: 'plan-monthly',
        subscriptionExpiresAt: '2026-07-11',
        balance: 1000.00,
        trafficUsed: 0,
        trafficLimit: 10240
      },
      {
        email: 'test@example.com',
        passwordHash: 'hashed_password_for_test',
        subscriptionStatus: 'EXPIRED',
        subscriptionPlanId: 'plan-monthly',
        subscriptionExpiresAt: '2026-05-11',
        balance: 50.00,
        trafficUsed: 5120,
        trafficLimit: 10240
      },
      {
        email: 'demo@example.com',
        passwordHash: 'hashed_password_for_demo',
        subscriptionStatus: 'ACTIVE',
        subscriptionPlanId: 'plan-1year',
        subscriptionExpiresAt: '2027-06-11',
        balance: 500.00,
        trafficUsed: 0,
        trafficLimit: 102400
      }
    ]);

    await nodeRepository.save([
      {
        name: 'US-West-1',
        region: 'United States',
        ipAddress: 'us-west-1.vpn.example.com',
        serverAddress: 'us-west-1',
        port: 443,
        serverPort: 443,
        delay: 100,
        status: 'online',
        load: 0.0,
        bandwidth: 0.0
      },
      {
        name: 'US-East-1',
        region: 'United States',
        ipAddress: 'us-east-1.vpn.example.com',
        serverAddress: 'us-east-1',
        port: 1194,
        serverPort: 1194,
        delay: 150,
        status: 'online',
        load: 0.0,
        bandwidth: 0.0
      },
      {
        name: 'EU-West',
        region: 'Europe',
        ipAddress: 'eu-west-1.vpn.example.com',
        serverAddress: 'eu-west-1',
        port: 443,
        serverPort: 443,
        delay: 80,
        status: 'online',
        load: 0.0,
        bandwidth: 0.0
      },
      {
        name: 'EU-East',
        region: 'Europe',
        ipAddress: 'eu-east-1.vpn.example.com',
        serverAddress: 'eu-east-1',
        port: 1194,
        serverPort: 1194,
        delay: 120,
        status: 'online',
        load: 0.0,
        bandwidth: 0.0
      },
      {
        name: 'Asia-Pacific',
        region: 'Asia',
        ipAddress: 'apac-1.vpn.example.com',
        serverAddress: 'apac-1',
        port: 443,
        serverPort: 443,
        delay: 200,
        status: 'offline',
        load: 0.0,
        bandwidth: 0.0
      },
      {
        name: 'Australia',
        region: 'Australia',
        ipAddress: 'australia-1.vpn.example.com',
        serverAddress: 'australia-1',
        port: 1194,
        serverPort: 1194,
        delay: 250,
        status: 'online',
        load: 0.0,
        bandwidth: 0.0
      },
      {
        name: 'South America',
        region: 'South America',
        ipAddress: 'south-america-1.vpn.example.com',
        serverAddress: 'south-america-1',
        port: 443,
        serverPort: 443,
        delay: 180,
        status: 'online',
        load: 0.0,
        bandwidth: 0.0
      },
      {
        name: 'South Africa',
        region: 'Africa',
        ipAddress: 'africa-1.vpn.example.com',
        serverAddress: 'africa-1',
        port: 1194,
        serverPort: 1194,
        delay: 300,
        status: 'online',
        load: 0.0,
        bandwidth: 0.0
      }
    ]);

    await vpnConfigRepository.save([
      {
        userId: 'user-1',
        nodeId: 'node-1',
        protocol: 'tcp',
        address: 'us-west-1.vpn.example.com',
        port: 443,
        path: '/us-west',
        serverName: 'US-West-1 Config'
      },
      {
        userId: 'user-1',
        nodeId: 'node-2',
        protocol: 'udp',
        address: 'us-east-1.vpn.example.com',
        port: 1194,
        path: '/us-east',
        serverName: 'US-East-1 Config'
      },
      {
        userId: 'user-2',
        nodeId: 'node-3',
        protocol: 'tcp',
        address: 'eu-west-1.vpn.example.com',
        port: 443,
        path: '/eu-west',
        serverName: 'EU-West Config'
      },
      {
        userId: 'user-2',
        nodeId: 'node-4',
        protocol: 'udp',
        address: 'eu-east-1.vpn.example.com',
        port: 1194,
        path: '/eu-east',
        serverName: 'EU-East Config'
      }
    ]);

    await orderRepository.save([
      {
        userId: 'user-1',
        subscriptionPlanId: 'plan-monthly',
        amount: 19.99,
        paymentMethod: OrderPaymentMethod.ALIPAY,
        status: OrderStatus.COMPLETED,
        payUrl: 'pay-url-1',
        paymentTransactionId: 'txn-1'
      },
      {
        userId: 'user-2',
        subscriptionPlanId: 'plan-3months',
        amount: 49.99,
        paymentMethod: OrderPaymentMethod.WECHAT_PAY,
        status: OrderStatus.COMPLETED,
        payUrl: 'pay-url-2',
        paymentTransactionId: 'txn-2'
      },
      {
        userId: 'user-1',
        subscriptionPlanId: 'plan-1year',
        amount: 149.99,
        paymentMethod: OrderPaymentMethod.ALIPAY,
        status: OrderStatus.COMPLETED,
        payUrl: 'pay-url-3',
        paymentTransactionId: 'txn-3'
      },
      {
        userId: 'user-3',
        subscriptionPlanId: 'plan-monthly',
        amount: 19.99,
        paymentMethod: OrderPaymentMethod.ALIPAY,
        status: OrderStatus.PENDING,
        payUrl: 'pay-url-4',
        paymentTransactionId: 'txn-4'
      }
    ]);

    await userSubscriptionRepository.save([
      {
        userId: 'user-1',
        subscriptionPlanId: 'plan-monthly',
        totalCost: 19.99,
        status: SubscriptionStatus.ACTIVE,
        endDate: '2026-07-11',
        trafficUsed: 0,
        trafficLimit: 10240
      },
      {
        userId: 'user-2',
        subscriptionPlanId: 'plan-monthly',
        totalCost: 19.99,
        status: SubscriptionStatus.EXPIRED,
        endDate: '2026-05-11',
        trafficUsed: 5120,
        trafficLimit: 10240
      },
      {
        userId: 'user-3',
        subscriptionPlanId: 'plan-1year',
        totalCost: 149.99,
        status: SubscriptionStatus.ACTIVE,
        endDate: '2027-06-11',
        trafficUsed: 0,
        trafficLimit: 102400
      }
    ]);

    await connectionLogRepository.save([
      {
        userId: 'user-1',
        nodeId: 'node-1',
        connectAt: new Date(),
        disconnectAt: '2026-06-10 10:05:00',
        duration: 300,
        traffic: 1024,
        status: 'CONNECTED'
      },
      {
        userId: 'user-2',
        nodeId: 'node-3',
        connectAt: new Date(),
        disconnectAt: '2026-06-09 16:00:00',
        duration: 1800,
        traffic: 2048,
        status: 'CONNECTED'
      },
      {
        userId: 'user-1',
        nodeId: 'node-2',
        connectAt: new Date(),
        disconnectAt: null,
        duration: 0,
        traffic: 0,
        status: 'CONNECTING'
      }
    ]);

    await systemLogRepository.save([
      {
        level: LogLevel.INFO,
        message: 'User login successful',
        source: LogSource.SYSTEM,
        userId: 'user-1',
        ipAddress: '192.168.1.100'
      },
      {
        level: LogLevel.WARNING,
        message: 'Node latency high',
        source: LogSource.SYSTEM,
        userId: null,
        ipAddress: null
      },
      {
        level: LogLevel.ERROR,
        message: 'Payment verification failed',
        source: LogSource.PAYMENT_SERVICE,
        userId: null,
        ipAddress: '192.168.1.200'
      },
      {
        level: LogLevel.INFO,
        message: 'System initialization complete',
        source: LogSource.SYSTEM,
        userId: null,
        ipAddress: null
      },
      {
        level: LogLevel.DEBUG,
        message: 'User subscription check',
        source: LogSource.SYSTEM,
        userId: 'user-2',
        ipAddress: '192.168.1.150'
      }
    ]);

    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error during seed:', error);
    throw error;
  }
}

async function checkIfDataExists(dataSource: DataSource): Promise<boolean> {
  const tablesToCheck = [
    'subscription_plans',
    'users',
    'nodes',
    'orders',
    'user_subscriptions',
    'vpn_configurations',
    'connection_logs',
    'system_logs'
  ];

  for (const table of tablesToCheck) {
    const result = await dataSource.query(
      `SELECT EXISTS (SELECT 1 FROM ${table} WHERE 1=1) as exists`
    );
    if (result && result[0] && result[0].exists) {
      console.log(`Table ${table} already has data.`);
      return true;
    }
  }

  return false;
}