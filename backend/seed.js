--VPN;
Service;
Database;
Seed;
Script;
--This;
script;
creates;
sample;
data;
for (testing; --Note; )
    : UUID;
fields;
will;
be;
automatically;
generated;
by;
PostgreSQL;
--Insert;
Subscription;
Plans;
INSERT;
INTO;
"subscription_plans"(name, price, "durationDays", "monthlyTraffic", "isActive", "displayOrder", "createdAt", "updatedAt");
VALUES('Monthly Plan', 19.99, 30, 100, true, 1, NOW(), NOW()),
    ('3-Month Plan', 49.99, 90, 200, true, 2, NOW(), NOW()),
    ('6-Month Plan', 79.99, 180, 300, true, 3, NOW(), NOW()),
    ('1-Year Plan', 149.99, 365, 500, true, 4, NOW(), NOW());
--Insert;
Users;
INSERT;
INTO;
users(email, passwordHash, subscriptionStatus, subscriptionPlanId, subscriptionExpiresAt, balance, trafficUsed, trafficLimit, "createdAt", "updatedAt");
VALUES('admin@example.com', 'hashed_password_for_admin', 'ACTIVE', 'plan-monthly', '2026-07-11', 1000.00, 0, 10240, NOW(), NOW()),
    ('test@example.com', 'hashed_password_for_test', 'EXPIRED', 'plan-monthly', '2026-05-11', 50.00, 5120, 10240, NOW(), NOW()),
    ('demo@example.com', 'hashed_password_for_demo', 'ACTIVE', 'plan-1year', '2027-06-11', 500.00, 0, 102400, NOW(), NOW());
--Insert;
Nodes;
INSERT;
INTO;
nodes(name, region, protocol, address, port, path, serverName, delay, status, isFree, "createdAt", "updatedAt");
VALUES('US-West-1', 'United States', 'tcp', 'us-west-1.vpn.example.com', 443, '/us-west', 'US-West-1', 100, 'ONLINE', true, NOW(), NOW()),
    ('US-East-1', 'United States', 'udp', 'us-east-1.vpn.example.com', 1194, '/us-east', 'US-East-1', 150, 'ONLINE', true, NOW(), NOW()),
    ('EU-West', 'Europe', 'tcp', 'eu-west-1.vpn.example.com', 443, '/eu-west', 'EU-West', 80, 'ONLINE', true, NOW(), NOW()),
    ('EU-East', 'Europe', 'udp', 'eu-east-1.vpn.example.com', 1194, '/eu-east', 'EU-East', 120, 'ONLINE', true, NOW(), NOW()),
    ('Asia-Pacific', 'Asia', 'tcp', 'apac-1.vpn.example.com', 443, '/apac', 'Asia-Pacific', 200, 'OFFLINE', true, NOW(), NOW()),
    ('Australia', 'Australia', 'udp', 'australia-1.vpn.example.com', 1194, '/australia', 'Australia', 250, 'ONLINE', false, NOW(), NOW()),
    ('South America', 'South America', 'tcp', 'south-america-1.vpn.example.com', 443, '/south-america', 'South America', 180, 'ONLINE', true, NOW(), NOW()),
    ('South Africa', 'Africa', 'udp', 'africa-1.vpn.example.com', 1194, '/africa', 'South Africa', 300, 'ONLINE', false, NOW(), NOW());
--Insert;
VPN;
Configurations;
INSERT;
INTO;
vpn_configurations(userId, nodeId, protocol, address, port, path, serverName, "createdAt", "updatedAt");
VALUES('user-1', 'node-1', 'tcp', 'us-west-1.vpn.example.com', 443, '/us-west', 'US-West-1 Config', NOW(), NOW()),
    ('user-1', 'node-2', 'udp', 'us-east-1.vpn.example.com', 1194, '/us-east', 'US-East-1 Config', NOW(), NOW()),
    ('user-2', 'node-3', 'tcp', 'eu-west-1.vpn.example.com', 443, '/eu-west', 'EU-West Config', NOW(), NOW()),
    ('user-2', 'node-4', 'udp', 'eu-east-1.vpn.example.com', 1194, '/eu-east', 'EU-East Config', NOW(), NOW());
--Insert;
Orders;
INSERT;
INTO;
orders(userId, planId, amount, paymentMethod, status, payUrl, paymentTransactionId, paidAt, "createdAt", "updatedAt");
VALUES('user-1', 'plan-monthly', 19.99, 'alipay', 'COMPLETED', 'pay-url-1', 'txn-1', NOW(), NOW(), NOW()),
    ('user-2', 'plan-3months', 49.99, 'wechat', 'COMPLETED', 'pay-url-2', 'txn-2', NOW(), NOW(), NOW()),
    ('user-1', 'plan-1year', 149.99, 'alipay', 'COMPLETED', 'pay-url-3', 'txn-3', NOW(), NOW(), NOW()),
    ('user-3', 'plan-monthly', 19.99, 'alipay', 'PENDING', 'pay-url-4', 'txn-4', NOW(), NOW(), NOW());
--Insert;
User;
Subscriptions;
INSERT;
INTO;
user_subscriptions(userId, subscriptionPlanId, pricePaid, status, expiresAt, trafficUsed, trafficLimit, "createdAt", "updatedAt");
VALUES('user-1', 'plan-monthly', 19.99, 'ACTIVE', '2026-07-11', 0, 10240, NOW(), NOW()),
    ('user-2', 'plan-monthly', 19.99, 'EXPIRED', '2026-05-11', 5120, 10240, NOW(), NOW()),
    ('user-3', 'plan-1year', 149.99, 'ACTIVE', '2027-06-11', 0, 102400, NOW(), NOW());
--Insert;
Connection;
Logs;
INSERT;
INTO;
connection_logs(userId, nodeId, connectAt, disconnectAt, duration, traffic, status, "createdAt", "updatedAt");
VALUES('user-1', 'node-1', NOW(), '2026-06-10 10:05:00', 300, 1024, 'CONNECTED', NOW(), NOW()),
    ('user-2', 'node-3', NOW(), '2026-06-09 16:00:00', 1800, 2048, 'CONNECTED', NOW(), NOW()),
    ('user-1', 'node-2', NOW(), NULL, 0, 0, 'CONNECTING', NOW(), NOW());
--Insert;
System;
Logs;
INSERT;
INTO;
system_logs(level, message, errorCode, userId, ipAddress, "createdAt");
VALUES('INFO', 'User login successful', NULL, 'user-1', '192.168.1.100', NOW()),
    ('WARNING', 'Node latency high', NULL, NULL, NULL, NOW()),
    ('ERROR', 'Payment verification failed', 'PAYMENT-001', NULL, '192.168.1.200', NOW()),
    ('INFO', 'System initialization complete', NULL, NULL, NULL, NOW()),
    ('DEBUG', 'User subscription check', NULL, 'user-2', '192.168.1.150', NOW());
SELECT;
'Seed data inserted successfully!';
//# sourceMappingURL=seed.js.map