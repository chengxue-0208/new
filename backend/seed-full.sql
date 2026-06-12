-- VPN Service Database Seed Script - Full Version (lowercase column names)

-- Insert Subscription Plans
INSERT INTO "subscription_plans" (id, name, price, "durationDays", "monthlyTraffic", "isActive", "displayOrder", created_at, updated_at) VALUES
  ('plan-monthly', 'Monthly Plan', 19.99, 30, 100, true, 1, NOW(), NOW()),
  ('plan-3months', '3-Month Plan', 49.99, 90, 200, true, 2, NOW(), NOW()),
  ('plan-6months', '6-Month Plan', 79.99, 180, 300, true, 3, NOW(), NOW()),
  ('plan-1year', '1-Year Plan', 149.99, 365, 500, true, 4, NOW(), NOW());

-- Insert Users
INSERT INTO users (id, email, passwordHash, subscriptionStatus, subscriptionPlanId, subscriptionExpiresAt, balance, trafficUsed, trafficLimit, created_at, updated_at) VALUES
  ('user-1', 'admin@example.com', 'hashed_password_for_admin', 'ACTIVE', 'plan-monthly', '2026-07-11', 1000.00, 0, 10240, NOW(), NOW()),
  ('user-2', 'test@example.com', 'hashed_password_for_test', 'EXPIRED', 'plan-monthly', '2026-05-11', 50.00, 5120, 10240, NOW(), NOW()),
  ('user-3', 'demo@example.com', 'hashed_password_for_demo', 'ACTIVE', 'plan-1year', '2027-06-11', 500.00, 0, 102400, NOW(), NOW());

-- Insert Nodes
INSERT INTO nodes (id, name, region, protocol, address, port, path, serverName, delay, status, isFree, created_at, updated_at) VALUES
  ('node-1', 'US-West-1', 'United States', 'tcp', 'us-west-1.vpn.example.com', 443, '/us-west', 'US-West-1', 100, 'ONLINE', true, NOW(), NOW()),
  ('node-2', 'US-East-1', 'United States', 'udp', 'us-east-1.vpn.example.com', 1194, '/us-east', 'US-East-1', 150, 'ONLINE', true, NOW(), NOW()),
  ('node-3', 'EU-West', 'Europe', 'tcp', 'eu-west-1.vpn.example.com', 443, '/eu-west', 'EU-West', 80, 'ONLINE', true, NOW(), NOW()),
  ('node-4', 'EU-East', 'Europe', 'udp', 'eu-east-1.vpn.example.com', 1194, '/eu-east', 'EU-East', 120, 'ONLINE', true, NOW(), NOW()),
  ('node-5', 'Asia-Pacific', 'Asia', 'tcp', 'apac-1.vpn.example.com', 443, '/apac', 'Asia-Pacific', 200, 'OFFLINE', true, NOW(), NOW()),
  ('node-6', 'Australia', 'Australia', 'udp', 'australia-1.vpn.example.com', 1194, '/australia', 'Australia', 250, 'ONLINE', false, NOW(), NOW()),
  ('node-7', 'South America', 'South America', 'tcp', 'south-america-1.vpn.example.com', 443, '/south-america', 'South America', 180, 'ONLINE', true, NOW(), NOW()),
  ('node-8', 'South Africa', 'Africa', 'udp', 'africa-1.vpn.example.com', 1194, '/africa', 'South Africa', 300, 'ONLINE', false, NOW(), NOW());

-- Insert VPN Configurations
INSERT INTO vpn_configurations (id, userId, nodeId, protocol, address, port, path, serverName, createdAt, updatedAt) VALUES
  ('vpn-config-1', 'user-1', 'node-1', 'tcp', 'us-west-1.vpn.example.com', 443, '/us-west', 'US-West-1 Config', NOW(), NOW()),
  ('vpn-config-2', 'user-1', 'node-2', 'udp', 'us-east-1.vpn.example.com', 1194, '/us-east', 'US-East-1 Config', NOW(), NOW()),
  ('vpn-config-3', 'user-2', 'node-3', 'tcp', 'eu-west-1.vpn.example.com', 443, '/eu-west', 'EU-West Config', NOW(), NOW()),
  ('vpn-config-4', 'user-2', 'node-4', 'udp', 'eu-east-1.vpn.example.com', 1194, '/eu-east', 'EU-East Config', NOW(), NOW());

-- Insert Orders
INSERT INTO orders (id, userId, planId, amount, paymentMethod, status, payUrl, paymentTransactionId, paidAt, createdAt, updatedAt) VALUES
  ('order-1', 'user-1', 'plan-monthly', 19.99, 'alipay', 'COMPLETED', 'pay-url-1', 'txn-1', NOW(), NOW(), NOW()),
  ('order-2', 'user-2', 'plan-3months', 49.99, 'wechat', 'COMPLETED', 'pay-url-2', 'txn-2', NOW(), NOW(), NOW()),
  ('order-3', 'user-1', 'plan-1year', 149.99, 'alipay', 'COMPLETED', 'pay-url-3', 'txn-3', NOW(), NOW(), NOW()),
  ('order-4', 'user-3', 'plan-monthly', 19.99, 'alipay', 'PENDING', 'pay-url-4', 'txn-4', NOW(), NOW(), NOW());

-- Insert User Subscriptions
INSERT INTO user_subscriptions (id, userId, subscriptionPlanId, pricePaid, status, expiresAt, trafficUsed, trafficLimit, createdAt, updatedAt) VALUES
  ('user-sub-1', 'user-1', 'plan-monthly', 19.99, 'ACTIVE', '2026-07-11', 0, 10240, NOW(), NOW()),
  ('user-sub-2', 'user-2', 'plan-monthly', 19.99, 'EXPIRED', '2026-05-11', 5120, 10240, NOW(), NOW()),
  ('user-sub-3', 'user-3', 'plan-1year', 149.99, 'ACTIVE', '2027-06-11', 0, 102400, NOW(), NOW());

-- Insert Connection Logs
INSERT INTO connection_logs (id, userId, nodeId, connectAt, disconnectAt, duration, traffic, status, createdAt, updatedAt) VALUES
  ('conn-log-1', 'user-1', 'node-1', NOW(), '2026-06-10 10:05:00', 300, 1024, 'CONNECTED', NOW(), NOW()),
  ('conn-log-2', 'user-2', 'node-3', NOW(), '2026-06-09 16:00:00', 1800, 2048, 'CONNECTED', NOW(), NOW()),
  ('conn-log-3', 'user-1', 'node-2', NOW(), NULL, 0, 0, 'CONNECTING', NOW(), NOW());

-- Insert System Logs
INSERT INTO system_logs (id, level, message, errorCode, userId, ipAddress, createdAt) VALUES
  ('sys-log-1', 'INFO', 'User login successful', NULL, 'user-1', '192.168.1.100', NOW()),
  ('sys-log-2', 'WARNING', 'Node latency high', NULL, NULL, NULL, NOW()),
  ('sys-log-3', 'ERROR', 'Payment verification failed', 'PAYMENT-001', NULL, '192.168.1.200', NOW()),
  ('sys-log-4', 'INFO', 'System initialization complete', NULL, NULL, NULL, NOW()),
  ('sys-log-5', 'DEBUG', 'User subscription check', NULL, 'user-2', '192.168.1.150', NOW());

SELECT 'Seed data inserted successfully!' as message;
