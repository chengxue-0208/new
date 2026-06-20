import { DataSource } from 'typeorm';
import { SubscriptionPlan, SubscriptionType } from './subscription-plan/subscription-plan.entity';
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

    const plans = await subscriptionPlanRepository.save([
      {
        name: 'Monthly Plan',
        type: SubscriptionType.MONTHLY,
        price: 19.99,
        durationDays: 30,
        trafficLimit: 10240,
        maxDevices: 3,
        description: 'Monthly VPN subscription',
        isActive: true
      },
      {
        name: '3-Month Plan',
        type: SubscriptionType.QUARTERLY,
        price: 49.99,
        durationDays: 90,
        trafficLimit: 20480,
        maxDevices: 5,
        description: 'Quarterly VPN subscription',
        isActive: true,
      },
      {
        name: '1-Year Plan',
        type: SubscriptionType.YEARLY,
        price: 149.99,
        durationDays: 365,
        trafficLimit: 102400,
        maxDevices: 10,
        description: 'Annual VPN subscription',
        isActive: true,
      }
    ]);

    const [monthlyPlan, quarterlyPlan, yearlyPlan] = plans;

    const users = await userRepository.save([
      {
        email: 'admin@example.com',
        username: 'admin',
        passwordHash: 'hashed_password_for_admin',
        subscriptionStatus: 'ACTIVE',
        subscriptionPlanId: monthlyPlan.id,
        subscriptionExpiresAt: new Date('2026-07-11'),
        balance: 1000.00,
        trafficUsed: 0,
        trafficLimit: 10240
      },
      {
        email: 'test@example.com',
        username: 'test',
        passwordHash: 'hashed_password_for_test',
        subscriptionStatus: 'EXPIRED',
        subscriptionPlanId: monthlyPlan.id,
        subscriptionExpiresAt: new Date('2026-05-11'),
        balance: 50.00,
        trafficUsed: 5120,
        trafficLimit: 10240
      },
      {
        email: 'demo@example.com',
        username: 'demo',
        passwordHash: 'hashed_password_for_demo',
        subscriptionStatus: 'ACTIVE',
        subscriptionPlanId: yearlyPlan.id,
        subscriptionExpiresAt: new Date('2027-06-11'),
        balance: 500.00,
        trafficUsed: 0,
        trafficLimit: 102400
      }
    ]);

    const [adminUser, testUser, demoUser] = users;

    const nodes = await nodeRepository.save([
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

    const [usWestNode, usEastNode, euWestNode, euEastNode] = nodes;

    await vpnConfigRepository.save([
      {
        name: 'US-West-1 Config',
        nodeId: usWestNode.id,
        protocol: 'tcp',
        port: 443,
        dns: '1.1.1.1',
        encryption: 'AES-256',
        isActive: true
      },
      {
        name: 'US-East-1 Config',
        nodeId: usEastNode.id,
        protocol: 'udp',
        port: 1194,
        dns: '8.8.8.8',
        encryption: 'AES-256',
        isActive: true
      },
      {
        name: 'EU-West Config',
        nodeId: euWestNode.id,
        protocol: 'tcp',
        port: 443,
        dns: '1.1.1.1',
        encryption: 'AES-256',
        isActive: true
      },
      {
        name: 'EU-East Config',
        nodeId: euEastNode.id,
        protocol: 'udp',
        port: 1194,
        dns: '8.8.8.8',
        encryption: 'AES-256',
        isActive: true
      }
    ]);

    await orderRepository.save([
      {
        userId: adminUser.id,
        orderId: 'ORD-001',
        subscriptionPlanId: monthlyPlan.id,
        amount: 19.99,
        totalAmount: 19.99,
        paymentMethod: OrderPaymentMethod.ALIPAY,
        status: OrderStatus.COMPLETED,
        planName: monthlyPlan.name,
        payUrl: 'pay-url-1',
        paymentTransactionId: 'txn-1'
      },
      {
        userId: testUser.id,
        orderId: 'ORD-002',
        subscriptionPlanId: quarterlyPlan.id,
        amount: 49.99,
        totalAmount: 49.99,
        paymentMethod: OrderPaymentMethod.WECHAT_PAY,
        status: OrderStatus.COMPLETED,
        planName: quarterlyPlan.name,
        payUrl: 'pay-url-2',
        paymentTransactionId: 'txn-2'
      },
      {
        userId: adminUser.id,
        orderId: 'ORD-003',
        subscriptionPlanId: yearlyPlan.id,
        amount: 149.99,
        totalAmount: 149.99,
        paymentMethod: OrderPaymentMethod.ALIPAY,
        status: OrderStatus.COMPLETED,
        planName: yearlyPlan.name,
        payUrl: 'pay-url-3',
        paymentTransactionId: 'txn-3'
      },
      {
        userId: demoUser.id,
        orderId: 'ORD-004',
        subscriptionPlanId: monthlyPlan.id,
        amount: 19.99,
        totalAmount: 19.99,
        paymentMethod: OrderPaymentMethod.ALIPAY,
        status: OrderStatus.PENDING,
        planName: monthlyPlan.name,
        payUrl: 'pay-url-4',
        paymentTransactionId: 'txn-4'
      }
    ]);

    await userSubscriptionRepository.save([
      {
        userId: adminUser.id,
        subscriptionPlanId: monthlyPlan.id,
        totalCost: 19.99,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date('2026-06-11'),
        endDate: new Date('2026-07-11'),
        trafficUsed: 0,
        trafficLimit: 10240
      },
      {
        userId: testUser.id,
        subscriptionPlanId: monthlyPlan.id,
        totalCost: 19.99,
        status: SubscriptionStatus.EXPIRED,
        startDate: new Date('2026-04-11'),
        endDate: new Date('2026-05-11'),
        trafficUsed: 5120,
        trafficLimit: 10240
      },
      {
        userId: demoUser.id,
        subscriptionPlanId: yearlyPlan.id,
        totalCost: 149.99,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date('2026-06-11'),
        endDate: new Date('2027-06-11'),
        trafficUsed: 0,
        trafficLimit: 102400
      }
    ]);

    await connectionLogRepository.save([
      {
        userId: adminUser.id,
        nodeId: usWestNode.id,
        connectAt: new Date(),
        disconnectAt: new Date('2026-06-10T10:05:00'),
        duration: 300,
        ip: '192.168.1.100',
        protocol: 'tcp',
        status: 'CONNECTED'
      },
      {
        userId: testUser.id,
        nodeId: euWestNode.id,
        connectAt: new Date(),
        disconnectAt: new Date('2026-06-09T16:00:00'),
        duration: 1800,
        ip: '192.168.1.150',
        protocol: 'tcp',
        status: 'CONNECTED'
      },
      {
        userId: adminUser.id,
        nodeId: usEastNode.id,
        connectAt: new Date(),
        disconnectAt: null,
        duration: 0,
        ip: '192.168.1.100',
        protocol: 'udp',
        status: 'CONNECTING'
      }
    ]);

    await systemLogRepository.save([
      {
        level: LogLevel.INFO,
        message: 'User login successful',
        source: LogSource.SYSTEM,
        userId: adminUser.id,
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
        userId: testUser.id,
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
  const entitiesToCheck = [
    SubscriptionPlan,
    User,
    Node,
    Order,
    UserSubscription,
    VPNConfiguration,
    ConnectionLog,
    SystemLog,
  ];

  for (const entity of entitiesToCheck) {
    const table = dataSource.getMetadata(entity).tablePath;
    const result = await dataSource.query(
      `SELECT EXISTS (SELECT 1 FROM "${table}" WHERE 1=1) as exists`
    );
    if (result && result[0] && result[0].exists) {
      console.log(`Table ${table} already has data.`);
      return true;
    }
  }

  return false;
}
