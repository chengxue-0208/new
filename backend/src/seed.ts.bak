import { DataSource } from 'typeorm';
import { User, Node, SubscriptionPlan, Order, ConnectionLog, SystemLog } from './entities';

export const seedDatabase = async (dataSource: DataSource) => {
  console.log('🌱 Seeding database...');

  try {
    const plans = [
      {
        name: '月度套餐',
        durationDays: 30,
        monthlyTraffic: 1024 * 1024 * 1024 * 10,
        price: 29.90,
        isActive: true,
        displayOrder: 1,
      },
      {
        name: '季度套餐',
        durationDays: 90,
        monthlyTraffic: 1024 * 1024 * 1024 * 30,
        price: 79.90,
        isActive: true,
        displayOrder: 2,
      },
      {
        name: '年度套餐',
        durationDays: 365,
        monthlyTraffic: 1024 * 1024 * 1024 * 100,
        price: 199.90,
        isActive: true,
        displayOrder: 3,
      },
      {
        name: '周卡套餐',
        durationDays: 7,
        monthlyTraffic: 1024 * 1024 * 1024 * 5,
        price: 9.90,
        isActive: true,
        displayOrder: 4,
      },
    ];

    await dataSource.getRepository(SubscriptionPlan).save(plans);
    console.log('✅ Subscription plans created');

    const nodes = [
      {
        name: '新加坡节点1',
        region: '新加坡',
        protocol: 'vless',
        address: 'sg1.example.com',
        port: 443,
        path: '/vless',
        serverName: 'sg1.example.com',
        delay: 45,
        status: 'online' as const,
        isFree: false,
      },
      {
        name: '美国节点1',
        region: '美国',
        protocol: 'vmess',
        address: 'us1.example.com',
        port: 443,
        path: '/vmess',
        serverName: 'us1.example.com',
        delay: 120,
        status: 'online' as const,
        isFree: true,
      },
      {
        name: '日本节点1',
        region: '日本',
        protocol: 'trojan',
        address: 'jp1.example.com',
        port: 443,
        path: '/trojan',
        serverName: 'jp1.example.com',
        delay: 65,
        status: 'online' as const,
        isFree: false,
      },
      {
        name: '香港节点1',
        region: '香港',
        protocol: 'vless',
        address: 'hk1.example.com',
        port: 443,
        path: '/vless',
        serverName: 'hk1.example.com',
        delay: 35,
        status: 'online' as const,
        isFree: false,
      },
      {
        name: '德国节点1',
        region: '德国',
        protocol: 'vmess',
        address: 'de1.example.com',
        port: 443,
        path: '/vmess',
        serverName: 'de1.example.com',
        delay: 150,
        status: 'offline' as const,
        isFree: true,
      },
    ];

    await dataSource.getRepository(Node).save(nodes);
    console.log('✅ Nodes created');

    const users = [
      {
        email: 'test@example.com',
        passwordHash: 'hashed_password_test',
        balance: 0,
        subscriptionStatus: 'ACTIVE' as const,
        subscriptionExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        trafficUsed: 1024 * 1024 * 1024 * 5,
        trafficLimit: 1024 * 1024 * 1024 * 30,
      },
    ];

    await dataSource.getRepository(User).save(users);
    console.log('✅ Users created');

    const orders = [
      {
        userId: users[0].id,
        planId: plans[1].id,
        amount: 79.90,
        paymentMethod: 'alipay',
        status: 'PAID' as const,
        paymentTransactionId: 'alipay_001',
        paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: users[0].id,
        planId: plans[0].id,
        amount: 29.90,
        paymentMethod: 'wechat',
        status: 'PAID' as const,
        paymentTransactionId: 'wechat_001',
        paidAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    ];

    await dataSource.getRepository(Order).save(orders);
    console.log('✅ Orders created');

    const connectionLogs = [
      {
        userId: users[0].id,
        nodeId: nodes[0].id,
        connectAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        disconnectAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 3600000),
        duration: 3600,
        traffic: 1024 * 1024 * 100,
        status: 'connected' as const,
      },
    ];

    await dataSource.getRepository(ConnectionLog).save(connectionLogs);
    console.log('✅ Connection logs created');

    const systemLogs = [
      {
        level: 'info' as const,
        message: 'Server started successfully',
        errorCode: null,
      },
      {
        level: 'warning' as const,
        message: 'High latency detected on node 4',
        errorCode: 'HIGH_LATENCY',
      },
    ];

    await dataSource.getRepository(SystemLog).save(systemLogs);
    console.log('✅ System logs created');

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};
