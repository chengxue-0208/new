const { Client } = require('pg');

async function runSeed() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'admin1234',
    database: 'vpn_db',
  });

  try {
    await client.connect();
    console.log('✅ Database connected');

    // 清空表数据
    await client.query(`
      DELETE FROM vpn_configurations;
      DELETE FROM connection_logs;
      DELETE FROM system_logs;
      DELETE FROM orders;
      DELETE FROM nodes;
      DELETE FROM subscription_plans WHERE name LIKE 'Monthly%' OR name LIKE '3-Month%' OR name LIKE '6-Month%' OR name LIKE '1-Year%';
      DELETE FROM user_subscriptions;
      DELETE FROM users WHERE email = 'admin@example.com' OR email = 'test@example.com' OR email = 'demo@example.com';
    `);

    console.log('✅ All tables cleared');

    // 插入订阅计划
    await client.query(`
      INSERT INTO subscription_plans (name, durationDays, monthlyTraffic, price, isActive, displayOrder)
      VALUES 
        ('Monthly Plan', 30, 100, 19.99, true, 1),
        ('3-Month Plan', 90, 200, 49.99, true, 2),
        ('6-Month Plan', 180, 300, 79.99, true, 3),
        ('1-Year Plan', 365, 500, 149.99, true, 4);
    `);

    console.log('✅ Subscription plans inserted');

    // 插入用户
    await client.query(`
      INSERT INTO users (email, password_hash, subscription_status, subscription_plan_id, subscription_expires_at, balance, traffic_used, traffic_limit, created_at, updated_at)
      VALUES 
        ('admin@example.com', 'hashed_password_for_admin', 'ACTIVE', 'plan-monthly', '2026-07-11', 1000.00, 0, 10240, NOW(), NOW()),
        ('test@example.com', 'hashed_password_for_test', 'EXPIRED', 'plan-monthly', '2026-05-11', 50.00, 5120, 10240, NOW(), NOW()),
        ('demo@example.com', 'hashed_password_for_demo', 'ACTIVE', 'plan-1year', '2027-06-11', 500.00, 0, 102400, NOW(), NOW());
    `);

    console.log('✅ Users inserted');

    // 插入节点
    await client.query(`
      INSERT INTO nodes (name, region, protocol, address, port, server_port, delay, status, load, bandwidth, created_at, updated_at)
      VALUES 
        ('US-West-1', 'United States', 'TCP', 'us-west-1.vpn.example.com', 443, 443, 100, 'online', 0.0, 0.0, NOW(), NOW()),
        ('US-East-1', 'United States', 'UDP', 'us-east-1.vpn.example.com', 1194, 1194, 150, 'online', 0.0, 0.0, NOW(), NOW()),
        ('EU-West', 'Europe', 'TCP', 'eu-west-1.vpn.example.com', 443, 443, 80, 'online', 0.0, 0.0, NOW(), NOW()),
        ('EU-East', 'Europe', 'UDP', 'eu-east-1.vpn.example.com', 1194, 1194, 120, 'online', 0.0, 0.0, NOW(), NOW()),
        ('Asia-Pacific', 'Asia', 'TCP', 'apac-1.vpn.example.com', 443, 443, 200, 'offline', 0.0, 0.0, NOW(), NOW()),
        ('Australia', 'Australia', 'UDP', 'australia-1.vpn.example.com', 1194, 1194, 250, 'online', 0.0, 0.0, NOW(), NOW()),
        ('South America', 'South America', 'TCP', 'south-america-1.vpn.example.com', 443, 443, 180, 'online', 0.0, 0.0, NOW(), NOW()),
        ('South Africa', 'Africa', 'UDP', 'africa-1.vpn.example.com', 1194, 1194, 300, 'online', 0.0, 0.0, NOW(), NOW());
    `);

    console.log('✅ Nodes inserted');

    console.log('✅ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await client.end();
    process.exit(0);
  }
}

runSeed().catch((error) => {
  console.error(error);
  process.exit(1);
});