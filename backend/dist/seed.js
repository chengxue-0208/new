"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const entities_1 = require("./entities");
const seedDatabase = async (dataSource) => {
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
        ];
        await dataSource.getRepository(entities_1.SubscriptionPlan).save(plans);
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
                status: 'online',
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
                status: 'online',
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
                status: 'online',
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
                status: 'online',
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
                status: 'offline',
                isFree: true,
            },
        ];
        await dataSource.getRepository(entities_1.Node).save(nodes);
        console.log('✅ Nodes created');
        const hashedPassword = 'hashed_password_example';
        const testUser = {
            email: 'test@example.com',
            passwordHash: hashedPassword,
            balance: 0,
            subscriptionStatus: 'ACTIVE',
            subscriptionExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            trafficUsed: 0,
            trafficLimit: 0,
        };
        await dataSource.getRepository(entities_1.User).save(testUser);
        console.log('✅ Test user created');
        console.log('🎉 Database seeding completed!');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
};
exports.seedDatabase = seedDatabase;
//# sourceMappingURL=seed.js.map