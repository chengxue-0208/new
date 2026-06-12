# API测试报告 - 重新测试

## 测试时间
2024-06-11

## 测试环境
- PostgreSQL: localhost:5432, 数据库: vpn_db
- 后端端口: 3000
- 前端端口: 3001

## 测试步骤

### 1. 数据库检查
```bash
docker exec vpn-service-postgres-1 psql -U admin -d vpn_db -c "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM nodes;"
```

### 2. 后端启动
```bash
cd /home/cheng/Project/vpn-service/backend
npx ts-node src/main.ts
```

### 3. API端点测试

#### 用户管理
- GET /users - 获取所有用户
- GET /users/:id - 获取单个用户
- POST /users - 创建用户
- PUT /users/:id - 更新用户
- DELETE /users/:id - 删除用户

#### 节点管理
- GET /nodes - 获取所有节点
- GET /nodes/:id - 获取单个节点
- POST /nodes - 创建节点
- PUT /nodes/:id - 更新节点
- DELETE /nodes/:id - 删除节点

#### 订阅计划管理
- GET /subscription-plans - 获取所有订阅计划
- GET /subscription-plans/:id - 获取单个订阅计划
- POST /subscription-plans - 创建订阅计划
- PUT /subscription-plans/:id - 更新订阅计划
- DELETE /subscription-plans/:id - 删除订阅计划

#### 订单管理
- GET /orders - 获取所有订单
- GET /orders/:id - 获取单个订单
- POST /orders - 创建订单
- PUT /orders/:id - 更新订单
- DELETE /orders/:id - 删除订单

#### 用户订阅管理
- GET /user-subscriptions - 获取所有用户订阅
- GET /user-subscriptions/:id - 获取单个用户订阅
- POST /user-subscriptions - 创建用户订阅
- PUT /user-subscriptions/:id - 更新用户订阅
- DELETE /user-subscriptions/:id - 删除用户订阅

#### VPN配置管理
- GET /vpn-configurations - 获取所有VPN配置
- GET /vpn-configurations/:id - 获取单个VPN配置
- POST /vpn-configurations - 创建VPN配置
- PUT /vpn-configurations/:id - 更新VPN配置
- DELETE /vpn-configurations/:id - 删除VPN配置

#### 用户连接管理
- GET /user-connections - 获取所有用户连接
- GET /user-connections/:id - 获取单个用户连接
- POST /user-connections - 创建用户连接
- PUT /user-connections/:id - 更新用户连接
- DELETE /user-connections/:id - 删除用户连接

#### 系统日志管理
- GET /system-logs - 获取所有系统日志
- GET /system-logs/:id - 获取单个系统日志
- POST /system-logs - 创建系统日志
- PUT /system-logs/:id - 更新系统日志
- DELETE /system-logs/:id - 删除系统日志

#### VPN配置管理
- GET /vpn-config - 获取VPN配置
- GET /vpn-config/:id - 获取单个VPN配置
- POST /vpn-config - 创建VPN配置
- PUT /vpn-config/:id - 更新VPN配置
- DELETE /vpn-config/:id - 删除VPN配置

## 期望结果
- 所有API端点返回正确的HTTP状态码和数据
- 数据库操作正确执行
- 错误处理正常工作

## 注意事项
1. TypeORM的synchronize设置为true，会自动创建数据库表
2. JWT认证需要在请求头中包含token
3. 部分端点可能需要管理员权限

## 测试命令
```bash
# 测试用户端点
curl http://localhost:3000/users
curl http://localhost:3000/users/test-id

# 测试节点端点
curl http://localhost:3000/nodes
curl http://localhost:3000/nodes/node-id

# 测试订阅计划端点
curl http://localhost:3000/subscription-plans
curl http://localhost:3000/subscription-plans/plan-id

# 测试订单端点
curl http://localhost:3000/orders
curl http://localhost:3000/orders/order-id

# 测试用户订阅端点
curl http://localhost:3000/user-subscriptions
curl http://localhost:3000/user-subscriptions/subscription-id

# 测试VPN配置端点
curl http://localhost:3000/vpn-configurations
curl http://localhost:3000/vpn-configurations/config-id

# 测试用户连接端点
curl http://localhost:3000/user-connections
curl http://localhost:3000/user-connections/connection-id

# 测试系统日志端点
curl http://localhost:3000/system-logs
curl http://localhost:3000/system-logs/log-id
```

## 测试完成
测试完成后，请检查：
1. 所有API端点是否正常工作
2. 数据是否正确插入和读取
3. 错误处理是否正常
4. JWT认证是否正常工作