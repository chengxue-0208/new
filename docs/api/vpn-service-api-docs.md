# VPN 服务 API 文档

> 版本: 1.0.0
> 日期: 2026-06-09
> 基础URL: `http://localhost:3000/api`

## 目录

1. [认证接口](#认证接口)
2. [节点管理接口](#节点管理接口)
3. [VPN连接接口](#vpn连接接口)
4. [订阅管理接口](#订阅管理接口)
5. [订单管理接口](#订单管理接口)
6. [用户接口](#用户接口)
7. [支付接口](#支付接口)
8. [管理接口](#管理接口)
9. [系统接口](#系统接口)

---

## 通用说明

### 请求头

```http
Content-Type: application/json
Authorization: Bearer {accessToken}
```

### 分页参数

所有列表接口支持分页参数：

```javascript
{
  page: 1,      // 当前页码，从1开始
  limit: 20     // 每页条数
}
```

### 响应格式

成功响应：

```javascript
{
  "success": true,
  "data": { ... }
}
```

---

## 认证接口

### 1. 用户注册

注册新用户账号。

**请求：**

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com"
    },
    "accessToken": "jwt-token"
  }
}
```

### 2. 用户登录

用户登录获取访问令牌。

**请求：**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com"
    },
    "accessToken": "jwt-token"
  }
}
```

### 3. 获取用户信息

获取当前登录用户的详细信息。

**请求：**

```http
GET /api/user/profile
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "balance": 100.00,
    "subscriptionStatus": "ACTIVE",
    "trafficUsed": 1073741824,
    "trafficLimit": 10737418240
  }
}
```

---

## 节点管理接口

### 1. 获取节点列表

获取所有可用VPN节点。

**请求：**

```http
GET /api/nodes
```

**响应：**

```javascript
{
  "success": true,
  "data": [
    {
      "id": "node-id",
      "name": "新加坡节点1",
      "region": "新加坡",
      "protocol": "vless",
      "address": "sg1.example.com",
      "port": 443,
      "path": "/vless",
      "serverName": "sg1.example.com",
      "delay": 45,
      "status": "online",
      "isFree": false
    }
  ]
}
```

### 2. 获取单个节点信息

获取指定节点的详细信息。

**请求：**

```http
GET /api/nodes/{nodeId}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "node-id",
    "name": "新加坡节点1",
    "region": "新加坡",
    "protocol": "vless",
    "address": "sg1.example.com",
    "port": 443,
    "path": "/vless",
    "serverName": "sg1.example.com",
    "delay": 45,
    "status": "online",
    "isFree": false
  }
}
```

### 3. 节点延迟检测

检测节点的延迟。

**请求：**

```http
GET /api/node/delay/{nodeId}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "nodeId": "node-id",
    "delay": 45
  }
}
```

### 4. 批量更新节点延迟

批量检测所有节点延迟。

**请求：**

```http
POST /api/node/delay/update
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "delays": [...],
    "stats": {
      "total": 10,
      "online": 8,
      "offline": 2,
      "avgDelay": 65
    }
  }
}
```

### 5. 获取延迟统计

获取节点延迟统计信息。

**请求：**

```http
GET /api/node/delay/stats
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "total": 10,
    "online": 8,
    "offline": 2,
    "avgDelay": 65
  }
}
```

---

## VPN连接接口

### 1. 建立VPN连接

连接到指定的VPN节点。

**请求：**

```http
POST /api/vpn/connect
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "nodeId": "node-id"
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "vpn-config-id",
    "nodeId": "node-id",
    "protocol": "vless",
    "address": "sg1.example.com",
    "port": 443,
    "createdAt": "2026-06-09T10:00:00.000Z"
  }
}
```

### 2. 断开VPN连接

断开当前的VPN连接。

**请求：**

```http
POST /api/vpn/disconnect
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "message": "Disconnected"
  }
}
```

### 3. 获取VPN状态

获取当前VPN连接状态。

**请求：**

```http
GET /api/vpn/status
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "connected": true,
    "node": {
      "id": "node-id",
      "name": "新加坡节点1",
      "delay": 45
    },
    "trafficUsed": 1073741824,
    "trafficLimit": 10737418240
  }
}
```

### 4. 获取VPN配置

获取当前VPN配置信息。

**请求：**

```http
GET /api/vpn/config
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "protocol": "vless",
    "address": "sg1.example.com",
    "port": 443,
    "path": "/vless",
    "serverName": "sg1.example.com"
  }
}
```

---

## 订阅管理接口

### 1. 获取订阅套餐列表

获取所有可用的订阅套餐。

**请求：**

```http
GET /api/subscription/plans
```

**响应：**

```javascript
{
  "success": true,
  "data": [
    {
      "id": "plan-id",
      "name": "月度套餐",
      "durationDays": 30,
      "monthlyTraffic": 10737418240,
      "price": 29.90,
      "isActive": true,
      "displayOrder": 1
    }
  ]
}
```

### 2. 获取我的订阅

获取当前用户的订阅信息。

**请求：**

```http
GET /api/subscription/my
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "subscription": {
      "id": "subscription-id",
      "planId": "plan-id",
      "plan": {
        "name": "月度套餐",
        "durationDays": 30
      },
      "startAt": "2026-06-01T00:00:00.000Z",
      "endAt": "2026-07-01T00:00:00.000Z",
      "status": "ACTIVE",
      "trafficUsed": 1073741824,
      "trafficLimit": 10737418240
    },
    "trafficUsed": 1073741824,
    "trafficLimit": 10737418240
  }
}
```

### 3. 购买订阅

创建订单并购买订阅套餐。

**请求：**

```http
POST /api/subscription/purchase
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "planId": "plan-id",
  "paymentMethod": "alipay"
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "orderId": "order-id",
    "payUrl": "https://openapi.alipay.com/gateway.do?...",
    "amount": 29.90
  }
}
```

---

## 订单管理接口

### 1. 获取订单列表

获取用户的订单列表。

**请求：**

```http
GET /api/orders
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": [
    {
      "id": "order-id",
      "userId": "user-id",
      "planId": "plan-id",
      "amount": 29.90,
      "paymentMethod": "alipay",
      "status": "PAID",
      "paymentTransactionId": "alipay_001",
      "paidAt": "2026-06-09T10:00:00.000Z",
      "createdAt": "2026-06-09T09:00:00.000Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 20
}
```

### 2. 获取订单详情

获取指定订单的详细信息。

**请求：**

```http
GET /api/orders/{orderId}
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "order-id",
    "userId": "user-id",
    "planId": "plan-id",
    "amount": 29.90,
    "paymentMethod": "alipay",
    "status": "PAID",
    "paymentTransactionId": "alipay_001",
    "paidAt": "2026-06-09T10:00:00.000Z",
    "plan": {
      "name": "月度套餐"
    }
  }
}
```

---

## 用户接口

### 1. 获取用户信息

获取当前登录用户的详细信息。

**请求：**

```http
GET /api/user/profile
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "balance": 100.00,
    "subscriptionStatus": "ACTIVE",
    "trafficUsed": 1073741824,
    "trafficLimit": 10737418240
  }
}
```

### 2. 更新用户信息

更新用户的个人信息。

**请求：**

```http
PUT /api/user/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "email": "new@example.com"
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "new@example.com",
    "balance": 100.00,
    "subscriptionStatus": "ACTIVE",
    "trafficUsed": 1073741824,
    "trafficLimit": 10737418240
  }
}
```

### 3. 修改密码

修改用户密码。

**请求：**

```http
PUT /api/user/password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "oldPassword": "old-password",
  "newPassword": "new-password"
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "message": "Password updated successfully"
  }
}
```

### 4. 获取流量统计

获取用户的流量使用统计。

**请求：**

```http
GET /api/user/traffic
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "used": 1073741824,
    "limit": 10737418240,
    "percentage": 10,
    "totalUsed": 1073741824,
    "remaining": 9663407072
  }
}
```

---

## 支付接口

### 1. 创建支付订单

创建支付订单。

**请求：**

```http
POST /api/payment/create
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "planId": "plan-id",
  "paymentMethod": "alipay"
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "orderId": "order-id",
    "payUrl": "https://openapi.alipay.com/gateway.do?...",
    "amount": 29.90
  }
}
```

### 2. 支付宝回调

处理支付宝支付回调。

**请求：**

```http
POST /api/payment/callback/alipay?{queryParams}
```

**响应：**

```javascript
{
  "success": true,
  "message": "Payment successful"
}
```

### 3. 微信支付回调

处理微信支付回调。

**请求：**

```http
POST /api/payment/callback/wechat
Content-Type: application/json

{xmlData}
```

**响应：**

```javascript
{
  "success": true,
  "message": "Payment successful"
}
```

### 4. 验证支付结果

验证支付结果。

**请求：**

```http
GET /api/payment/verify?{queryParams}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "message": "Payment successful"
  }
}
```

---

## 管理接口

### 1. 获取统计数据

获取系统统计数据。

**请求：**

```http
GET /api/admin/stats
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "activeUsers": 800,
    "totalNodes": 50,
    "onlineNodes": 45,
    "totalOrders": 500,
    "successfulOrders": 480,
    "totalRevenue": 29900,
    "totalTrafficUsed": 1073741824
  }
}
```

### 2. 获取用户列表

获取用户列表。

**请求：**

```http
GET /api/admin/users?page=1&limit=20
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "users": [...],
    "total": 1000,
    "page": 1,
    "limit": 20
  }
}
```

### 3. 获取用户详情

获取用户详细信息。

**请求：**

```http
GET /api/admin/users/{userId}
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "balance": 100.00,
    "subscriptionStatus": "ACTIVE",
    "trafficUsed": 1073741824,
    "trafficLimit": 10737418240
  }
}
```

### 4. 获取节点列表

获取所有节点列表。

**请求：**

```http
GET /api/admin/nodes
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": [
    {
      "id": "node-id",
      "name": "新加坡节点1",
      "region": "新加坡",
      "protocol": "vless",
      "address": "sg1.example.com",
      "port": 443,
      "delay": 45,
      "status": "online"
    }
  ]
}
```

### 5. 创建节点

创建新节点。

**请求：**

```http
POST /api/admin/nodes
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "新节点",
  "region": "新加坡",
  "protocol": "vless",
  "address": "new.example.com",
  "port": 443,
  "status": "online",
  "isFree": false
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "new-node-id",
    "name": "新节点"
  }
}
```

### 6. 更新节点

更新节点信息。

**请求：**

```http
PUT /api/admin/nodes/{nodeId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "更新后的节点",
  "status": "online"
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "node-id",
    "name": "更新后的节点"
  }
}
```

### 7. 删除节点

删除节点。

**请求：**

```http
DELETE /api/admin/nodes/{nodeId}
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "message": "Node deleted successfully"
  }
}
```

### 8. 获取订单列表

获取所有订单列表。

**请求：**

```http
GET /api/admin/orders?page=1&limit=20
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "orders": [...],
    "total": 500,
    "page": 1,
    "limit": 20
  }
}
```

### 9. 获取日志列表

获取系统日志列表。

**请求：**

```http
GET /api/admin/logs?page=1&limit=50
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "logs": [...],
    "total": 1000,
    "page": 1,
    "limit": 50
  }
}
```

### 10. 删除日志

删除日志。

**请求：**

```http
DELETE /api/admin/logs/{logId}
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "message": "Log deleted successfully"
  }
}
```

### 11. 获取订阅套餐列表

获取订阅套餐列表。

**请求：**

```http
GET /api/admin/subscription-plans
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": [
    {
      "id": "plan-id",
      "name": "月度套餐",
      "durationDays": 30,
      "price": 29.90,
      "isActive": true
    }
  ]
}
```

### 12. 创建订阅套餐

创建新的订阅套餐。

**请求：**

```http
POST /api/admin/subscription-plans
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "新套餐",
  "durationDays": 30,
  "monthlyTraffic": 10737418240,
  "price": 29.90,
  "isActive": true,
  "displayOrder": 1
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "new-plan-id",
    "name": "新套餐"
  }
}
```

### 13. 更新订阅套餐

更新订阅套餐信息。

**请求：**

```http
PUT /api/admin/subscription-plans/{planId}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "更新后的套餐",
  "price": 39.90
}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "id": "plan-id",
    "name": "更新后的套餐"
  }
}
```

### 14. 删除订阅套餐

删除订阅套餐。

**请求：**

```http
DELETE /api/admin/subscription-plans/{planId}
Authorization: Bearer {accessToken}
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "message": "Subscription plan deleted successfully"
  }
}
```

---

## 系统接口

### 1. 系统健康检查

检查系统健康状态。

**请求：**

```http
GET /api/health
```

**响应：**

```javascript
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "1.0.0",
    "timestamp": "2026-06-09T10:00:00.000Z"
  }
}
```

---

## 错误响应

### 错误格式

```javascript
{
  "success": false,
  "message": "Error message",
  "error": "Error code"
}
```

### 常见错误码

- `401 Unauthorized`: 未授权，需要登录
- `403 Forbidden`: 禁止访问
- `404 Not Found`: 资源不存在
- `422 Unprocessable Entity`: 请求格式错误
- `500 Internal Server Error`: 服务器内部错误

---

## 注意事项

1. 所有需要认证的接口都需要在请求头中包含有效的JWT访问令牌
2. 支付接口需要配置相应的支付平台参数
3. 系统日志可以通过管理后台查看和删除
4. 订阅状态检查会在每次连接VPN时进行
5. 流量统计会定期更新，可能存在几秒钟的延迟

---

## 更新记录

### v1.0.0 (2026-06-09)

- 初始版本
- 实现基础认证和用户管理
- 实现VPN连接功能
- 实现节点管理功能
- 实现订阅管理功能
- 实现支付功能（支付宝、微信）
- 实现管理后台功能