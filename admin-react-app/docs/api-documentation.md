# API接口和数据模型文档

## 目录

- [项目概述](#项目概述)
- [API接口完整列表](#api接口完整列表)
- [TypeScript类型定义](#typescript类型定义)
- [路由结构](#路由结构)
- [主要功能模块](#主要功能模块)
- [配置相关信息](#配置相关信息)
- [数据交互模式](#数据交互模式)
- [API响应格式规范](#api响应格式规范)

---

## 项目概述

### 应用描述

VPN服务管理控制台前端应用，为管理员提供完整的VPN服务管理功能。

### 技术栈

- **前端框架**: React 19
- **语言**: TypeScript
- **UI组件库**: Ant Design
- **路由管理**: React Router
- **数据管理**: TanStack Query
- **构建工具**: Vite
- **HTTP客户端**: Axios

### 功能模块

| 模块名称 | 功能描述 |
|---------|---------|
| 认证模块 | 用户登录、注册 |
| 仪表盘模块 | 数据统计概览 |
| 用户管理模块 | 用户列表管理、搜索、编辑、删除 |
| 节点管理模块 | VPN节点管理、健康检查 |
| 订单管理模块 | 订单列表、状态管理 |
| 订阅计划模块 | 订阅计划配置、管理 |
| 系统日志模块 | 操作日志查看、筛选 |
| VPN配置模块 | VPN配置管理、预览 |
| 支付管理模块 | 支付接口（回调） |
| VPN连接模块 | 连接、断开、状态查询 |

---

## API接口完整列表

### 1. 认证模块

#### 1.1 登录接口

**接口描述**: 用户登录认证

**接口路径**: `POST /auth/login`

**请求参数**:

```typescript
{
  email: string;      // 用户邮箱
  password: string;   // 用户密码
}
```

**响应示例**:

```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "admin"
  },
  "accessToken": "string"
}
```

**HTTP状态码**:

| 状态码 | 说明 |
|-------|------|
| 200 | 登录成功 |
| 401 | 认证失败 |
| 422 | 参数错误 |

---

#### 1.2 注册接口

**接口描述**: 新用户注册

**接口路径**: `POST /auth/register`

**请求参数**:

```typescript
{
  email: string;      // 用户邮箱
  password: string;   // 用户密码
  username: string;   // 用户名
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "注册成功",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

---

### 2. 仪表盘模块

#### 2.1 统计数据接口

**接口描述**: 获取仪表盘统计数据

**接口路径**: `GET /dashboard/stats`

**请求参数**: 无

**响应示例**:

```json
{
  "data": {
    "totalUsers": number,
    "totalOrders": number,
    "totalRevenue": number
  }
}
```

---

### 3. 用户管理模块

#### 3.1 获取用户列表

**接口描述**: 分页获取用户列表

**接口路径**: `GET /users`

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10 |
| search | string | 否 | 搜索关键词 |

**响应示例**:

```json
{
  "data": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "balance": number,
      "trafficUsed": number,
      "trafficLimit": number,
      "subscriptionStatus": "ACTIVE|INACTIVE|EXPIRED|PENDING",
      "subscriptionExpiresAt": "string",
      "status": "active|inactive",
      "createdAt": "string"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

---

#### 3.2 更新用户信息

**接口描述**: 更新用户信息

**接口路径**: `PUT /users/{userId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| userId | string | 是 | 用户ID |

**请求体**:

```typescript
{
  balance: number;        // 余额
  trafficLimit: number;   // 流量上限(GB)
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "用户信息更新成功"
}
```

---

#### 3.3 删除用户

**接口描述**: 删除指定用户

**接口路径**: `DELETE /users/{userId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| userId | string | 是 | 用户ID |

**响应示例**:

```json
{
  "success": true,
  "message": "用户删除成功"
}
```

---

### 4. 节点管理模块

#### 4.1 获取所有节点

**接口描述**: 获取所有VPN节点列表

**接口路径**: `GET /nodes`

**响应示例**:

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "region": "string",
      "ipAddress": "string",
      "serverAddress": "string",
      "status": "online|offline|maintenance",
      "statusMessage": "string",
      "uptime": number,
      "load": number,
      "maxConnections": number,
      "currentConnections": number,
      "bandwidth": number
    }
  ]
}
```

---

#### 4.2 获取单个节点

**接口描述**: 根据ID获取节点详情

**接口路径**: `GET /nodes/{nodeId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| nodeId | string | 是 | 节点ID |

**响应示例**: 与获取所有节点相同

---

#### 4.3 按区域获取节点

**接口描述**: 根据区域获取节点

**接口路径**: `GET /nodes/by-region/{region}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| region | string | 是 | 区域标识 |

**响应示例**: 与获取所有节点相同

---

#### 4.4 创建节点

**接口描述**: 创建新的VPN节点

**接口路径**: `POST /nodes`

**请求体**:

```typescript
{
  name: string;                   // 节点名称
  region: string;                 // 区域
  ipAddress: string;              // IP地址
  serverAddress?: string;         // 服务器地址
  port?: number;                  // 端口
  maxConnections: number;         // 最大连接数
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "节点创建成功"
}
```

---

#### 4.5 更新节点

**接口描述**: 更新节点信息

**接口路径**: `PUT /nodes/{nodeId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| nodeId | string | 是 | 节点ID |

**请求体**: 与创建节点相同

---

#### 4.6 删除节点

**接口描述**: 删除节点

**接口路径**: `DELETE /nodes/{nodeId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| nodeId | string | 是 | 节点ID |

**响应示例**:

```json
{
  "success": true,
  "message": "节点删除成功"
}
```

---

#### 4.7 节点健康检查

**接口描述**: 批量检查节点健康状态

**接口路径**: `GET /nodes/health`

**响应示例**:

```json
{
  "total": number,
  "online": number,
  "offline": number,
  "nodes": [
    {
      "id": "string",
      "name": "string",
      "region": "string",
      "status": "online|offline",
      "uptime": number
    }
  ]
}
```

---

### 5. 订阅计划模块

#### 5.1 获取订阅计划列表

**接口描述**: 获取所有订阅计划

**接口路径**: `GET /subscription-plans`

**响应示例**:

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "type": "MONTHLY|QUARTERLY|YEARLY|LIFETIME",
      "price": number,
      "originalPrice": number,
      "durationDays": number,
      "trafficLimit": number,
      "maxDevices": number,
      "discountRate": number,
      "isActive": boolean
    }
  ]
}
```

---

#### 5.2 创建订阅计划

**接口描述**: 创建新的订阅计划

**接口路径**: `POST /subscription-plans`

**请求体**:

```typescript
{
  name: string;                   // 计划名称
  type: string;                   // 订阅类型
  price: number;                  // 价格(元)
  originalPrice?: number;         // 原价(元)
  durationDays: number;           // 时长(天)
  trafficLimit: number;           // 流量限制(GB)
  maxDevices: number;             // 最大设备数
  discountRate: number;           // 优惠率(%)
  isActive: boolean;              // 是否启用
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "订阅计划创建成功"
}
```

---

#### 5.3 更新订阅计划

**接口描述**: 更新订阅计划信息

**接口路径**: `PUT /subscription-plans/{planId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| planId | string | 是 | 计划ID |

**请求体**: 与创建订阅计划相同

---

#### 5.4 删除订阅计划

**接口描述**: 删除订阅计划

**接口路径**: `DELETE /subscription-plans/{planId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| planId | string | 是 | 计划ID |

**响应示例**:

```json
{
  "success": true,
  "message": "订阅计划删除成功"
}
```

---

### 6. 订单管理模块

#### 6.1 获取订单列表

**接口描述**: 分页获取订单列表

**接口路径**: `GET /orders`

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10 |
| search | string | 否 | 搜索关键词(订单号或用户) |
| status | string | 否 | 订单状态筛选 |

**订单状态枚举**:

| 状态值 | 说明 |
|-------|------|
| PENDING | 待支付 |
| PAID | 已支付 |
| COMPLETED | 已完成 |
| CANCELLED | 已取消 |
| REFUNDED | 已退款 |

**响应示例**:

```json
{
  "data": [
    {
      "id": "string",
      "orderNumber": "string",
      "userId": "string",
      "username": "string",
      "subscriptionPlanId": "string",
      "planName": "string",
      "status": "PENDING|PAID|COMPLETED|CANCELLED|REFUNDED",
      "totalAmount": number,
      "paidAmount": number,
      "discountAmount": number,
      "pointsUsed": number,
      "pointsEarned": number,
      "paymentMethod": "WALLET|CREDIT_CARD|ALIPAY|WECHAT_PAY|OTHER",
      "transactionId": "string",
      "createdAt": "string",
      "paymentTime": "string",
      "completedTime": "string"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

---

#### 6.2 获取订单详情

**接口描述**: 根据ID获取订单详情

**接口路径**: `GET /orders/{orderId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| orderId | string | 是 | 订单ID |

**响应示例**: 与获取订单列表相同

---

#### 6.3 更新订单信息

**接口描述**: 更新订单状态等信息

**接口路径**: `PUT /orders/{orderId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| orderId | string | 是 | 订单ID |

**请求体**:

```typescript
{
  status: string;                      // 订单状态
  paymentTime?: Date;                  // 支付时间
  transactionId?: string;              // 交易ID
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "订单信息更新成功"
}
```

---

#### 6.4 删除订单

**接口描述**: 删除订单

**接口路径**: `DELETE /orders/{orderId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| orderId | string | 是 | 订单ID |

**响应示例**:

```json
{
  "success": true,
  "message": "订单删除成功"
}
```

---

### 7. VPN配置模块

#### 7.1 获取VPN配置列表

**接口描述**: 获取所有VPN配置

**接口路径**: `GET /vpn-configs`

**响应示例**:

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "nodeId": "string",
      "node": "string",
      "protocol": "tcp|udp",
      "port": number,
      "dns": "string",
      "encryption": "string",
      "compression": "string",
      "bandwidth": number,
      "maxConnections": number,
      "currentConnections": number,
      "isActive": boolean
    }
  ]
}
```

---

#### 7.2 创建VPN配置

**接口描述**: 创建新的VPN配置

**接口路径**: `POST /vpn-configs`

**请求体**:

```typescript
{
  name: string;                  // 配置名称
  nodeId: string;                // 节点ID
  protocol: string;              // 协议类型(tcp|udp)
  port: number;                  // 端口
  dns?: string;                  // DNS服务器
  encryption?: string;           // 加密方式
  compression?: string;          // 压缩方式
  bandwidth: number;             // 带宽(MB)
  maxConnections: number;        // 最大连接数
  isActive: boolean;             // 是否启用
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "VPN配置创建成功"
}
```

---

#### 7.3 更新VPN配置

**接口描述**: 更新VPN配置信息

**接口路径**: `PUT /vpn-configs/{configId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| configId | string | 是 | 配置ID |

**请求体**: 与创建VPN配置相同

---

#### 7.4 删除VPN配置

**接口描述**: 删除VPN配置

**接口路径**: `DELETE /vpn-configs/{configId}`

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| configId | string | 是 | 配置ID |

**响应示例**:

```json
{
  "success": true,
  "message": "VPN配置删除成功"
}
```

---

### 8. 系统日志模块

#### 8.1 获取日志列表

**接口描述**: 分页获取系统日志

**接口路径**: `GET /logs`

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10 |
| search | string | 否 | 搜索日志消息 |
| level | string | 否 | 日志级别筛选 |
| dateFrom | string | 否 | 开始日期 |
| dateTo | string | 否 | 结束日期 |

**日志级别枚举**:

| 级别值 | 说明 |
|-------|------|
| info | 信息 |
| warning | 警告 |
| error | 错误 |

**响应示例**:

```json
{
  "data": [
    {
      "id": "string",
      "level": "info|warning|error",
      "message": "string",
      "ip": "string",
      "timestamp": "string"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

---

### 9. 支付管理模块

#### 9.1 创建支付订单

**接口描述**: 创建支付订单

**接口路径**: `POST /payment/create`

**请求体**:

```typescript
{
  planId: string;              // 订阅计划ID
  paymentMethod: string;       // 支付方式
  amount: number;              // 金额
}
```

**响应示例**:

```json
{
  "transactionId": "string",
  "qrCode": "string",          // 二维码(可选)
  "paymentUrl": "string",      // 支付URL(可选)
  "expireTime": "string"
}
```

---

#### 9.2 验证支付结果

**接口描述**: 验证支付交易结果

**接口路径**: `GET /payment/verify`

**查询参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| transactionId | string | 是 | 交易ID |

**响应示例**:

```json
{
  "success": boolean,
  "status": "SUCCESS|FAILED|PENDING",
  "amount": number
}
```

---

#### 9.3 支付宝回调

**接口描述**: 支付宝支付回调接口

**接口路径**: `POST /payment/callback/alipay`

**请求体**:

```typescript
{
  tradeNo: string;             // 支付宝交易号
  outTradeNo: string;          // 商户订单号
  totalAmount: number;         // 交易金额
  tradeStatus: string;         // 交易状态
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "支付成功"
}
```

---

#### 9.4 微信支付回调

**接口描述**: 微信支付回调接口

**接口路径**: `POST /payment/callback/wechat`

**请求体**:

```typescript
{
  transactionId: string;       // 微信订单号
  outTradeNo: string;          // 商户订单号
  totalAmount: number;         // 交易金额
  tradeStatus: string;         // 交易状态
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "支付成功"
}
```

---

### 10. VPN连接模块

#### 10.1 连接VPN

**接口描述**: 连接到指定节点

**接口路径**: `POST /vpn/connect`

**请求体**:

```typescript
{
  nodeId: string;              // 节点ID
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "VPN连接成功"
}
```

---

#### 10.2 断开VPN

**接口描述**: 断开VPN连接

**接口路径**: `POST /vpn/disconnect`

**请求体**: 无

**响应示例**:

```json
{
  "success": true,
  "message": "VPN断开成功"
}
```

---

#### 10.3 获取VPN状态

**接口描述**: 获取VPN当前状态

**接口路径**: `GET /vpn/status`

**请求体**: 无

**响应示例**:

```json
{
  "isConnected": boolean,
  "currentNode": string,
  "connectedAt": "string",
  "uploadSpeed": number,       // 上传速度
  "downloadSpeed": number,     // 下载速度
  "uptime": number             // 运行时间
}
```

---

#### 10.4 获取VPN配置

**接口描述**: 获取当前使用的VPN配置

**接口路径**: `GET /vpn/config`

**请求体**: 无

**响应示例**:

```json
{
  "protocol": "tcp|udp",
  "server": "string",
  "port": number,
  "dns": "string",
  "encryption": "string",
  "compression": "string"
}
```

---

#### 10.5 获取我的订阅

**接口描述**: 获取当前用户的订阅信息

**接口路径**: `GET /subscription/my`

**请求体**: 无

**响应示例**:

```json
{
  "isActive": boolean,
  "plan": {
    "id": "string",
    "name": "string",
    "type": "string"
  },
  "expiresAt": "string",
  "trafficUsed": number,
  "trafficLimit": number,
  "devices": number
}
```

---

#### 10.6 购买订阅

**接口描述**: 购买订阅计划

**接口路径**: `POST /subscription/purchase`

**请求体**:

```typescript
{
  planId: string;              // 订阅计划ID
  paymentMethod: string;       // 支付方式
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "购买成功",
  "subscription": {
    "id": "string",
    "planId": "string",
    "startDate": "string",
    "endDate": "string"
  }
}
```

---

## TypeScript类型定义

### 用户类型

```typescript
// 用户类型定义
interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  trafficUsed: number;
  trafficLimit: number;
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'PENDING';
  subscriptionExpiresAt: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// 用户表单数据
interface UserFormData {
  balance: number;
  trafficLimit: number;
}
```

### 节点类型

```typescript
// 节点类型定义
interface Node {
  id: string;
  name: string;
  region: string;
  ipAddress: string;
  serverAddress?: string;
  port?: number;
  status: 'online' | 'offline' | 'maintenance';
  statusMessage?: string;
  uptime: number;
  load: number;
  maxConnections: number;
  currentConnections: number;
  bandwidth: number;
}

// 节点表单数据
interface NodeFormData {
  name: string;
  region: string;
  ipAddress: string;
  serverAddress?: string;
  port?: number;
  maxConnections: number;
}
```

### 订单类型

```typescript
// 订单类型定义
interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  username: string;
  subscriptionPlanId: string;
  planName: string;
  status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  pointsUsed: number;
  pointsEarned: number;
  paymentMethod: 'WALLET' | 'CREDIT_CARD' | 'ALIPAY' | 'WECHAT_PAY' | 'OTHER';
  transactionId?: string;
  createdAt: string;
  paymentTime?: string;
  completedTime?: string;
}

// 订单表单数据
interface OrderFormData {
  status: string;
  paymentTime?: Date;
  transactionId?: string;
}
```

### 订阅计划类型

```typescript
// 订阅计划类型定义
interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME';
  price: number;
  originalPrice?: number;
  durationDays: number;
  trafficLimit: number;
  maxDevices: number;
  discountRate: number;
  isActive: boolean;
}

// 订阅计划表单数据
interface SubscriptionPlanFormData {
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
  durationDays: number;
  trafficLimit: number;
  maxDevices: number;
  discountRate: number;
  isActive: boolean;
}
```

### VPN配置类型

```typescript
// VPN配置类型定义
interface VPNConfig {
  id: string;
  name: string;
  nodeId: string;
  node: string;
  protocol: string;
  port: number;
  dns?: string;
  encryption?: string;
  compression?: string;
  bandwidth: number;
  maxConnections: number;
  currentConnections: number;
  isActive: boolean;
}

// VPN配置表单数据
interface VPNConfigFormData {
  name: string;
  nodeId: string;
  protocol: string;
  port: number;
  dns?: string;
  encryption?: string;
  compression?: string;
  bandwidth: number;
  maxConnections: number;
  isActive: boolean;
}
```

### 系统日志类型

```typescript
// 系统日志类型定义
interface Log {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  ip: string;
  timestamp: string;
}
```

### VPN状态类型

```typescript
// VPN状态类型定义
interface VPNStatus {
  isConnected: boolean;
  currentNode: string;
  connectedAt: string;
  uploadSpeed: number;
  downloadSpeed: number;
  uptime: number;
}

// VPN配置信息类型
interface VPNConfigInfo {
  protocol: 'tcp' | 'udp';
  server: string;
  port: number;
  dns: string;
  encryption: string;
  compression: string;
}
```

### 订阅信息类型

```typescript
// 我的订阅类型定义
interface MySubscription {
  isActive: boolean;
  plan: {
    id: string;
    name: string;
    type: string;
  };
  expiresAt: string;
  trafficUsed: number;
  trafficLimit: number;
  devices: number;
}
```

### 统计数据类型

```typescript
// 仪表盘统计数据类型
interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

// 节点健康状态类型
interface NodeHealth {
  total: number;
  online: number;
  offline: number;
  nodes: Node[];
}
```

---

## 路由结构

### 主路由定义

```typescript
// App.tsx中的路由配置
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
    <Route path="/nodes" element={<ProtectedRoute><Nodes /></ProtectedRoute>} />
    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
    <Route path="/subscription-plans" element={<ProtectedRoute><SubscriptionPlans /></ProtectedRoute>} />
    <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
    <Route path="/vpn-config" element={<ProtectedRoute><VPNConfig /></ProtectedRoute>} />
  </Routes>
</BrowserRouter>
```

### 路由模块

| 路由路径 | 组件 | 权限要求 | 功能描述 |
|---------|------|---------|---------|
| `/login` | Login | 公开 | 用户登录 |
| `/dashboard` | Dashboard | 管理员 | 仪表盘 |
| `/users` | Users | 管理员 | 用户管理 |
| `/nodes` | Nodes | 管理员 | 节点管理 |
| `/orders` | Orders | 管理员 | 订单管理 |
| `/subscription-plans` | SubscriptionPlans | 管理员 | 订阅计划管理 |
| `/logs` | Logs | 管理员 | 系统日志 |
| `/vpn-config` | VPNConfig | 管理员 | VPN配置管理 |

---

## 主要功能模块

### 1. 认证模块

**功能描述**: 提供用户登录和注册功能

**核心API**:
- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册

**特性**:
- JWT Token认证
- 自动Token管理
- 登录状态持久化
- 访问拦截

---

### 2. 用户管理模块

**功能描述**: 管理用户信息和订阅状态

**核心功能**:
- 用户列表展示和搜索
- 用户信息编辑
- 用户状态管理
- 余额管理
- 流量管理

**核心API**:
- `GET /users` - 获取用户列表
- `PUT /users/{userId}` - 更新用户
- `DELETE /users/{userId}` - 删除用户

---

### 3. 节点管理模块

**功能描述**: 管理VPN节点和健康状态

**核心功能**:
- 节点CRUD操作
- 节点健康检查
- 负载监控
- 在线状态监控
- 区域筛选

**核心API**:
- `GET /nodes` - 获取节点列表
- `GET /nodes/{nodeId}` - 获取节点详情
- `POST /nodes` - 创建节点
- `PUT /nodes/{nodeId}` - 更新节点
- `DELETE /nodes/{nodeId}` - 删除节点
- `GET /nodes/health` - 健康检查

---

### 4. 订单管理模块

**功能描述**: 管理用户订单和支付状态

**核心功能**:
- 订单列表展示
- 订单搜索和筛选
- 订单状态更新
- 订单删除
- 支付时间管理

**核心API**:
- `GET /orders` - 获取订单列表
- `GET /orders/{orderId}` - 获取订单详情
- `PUT /orders/{orderId}` - 更新订单
- `DELETE /orders/{orderId}` - 删除订单

---

### 5. 订阅计划模块

**功能描述**: 管理订阅计划配置

**核心功能**:
- 计划CRUD操作
- 计划类型管理
- 价格管理
- 优惠设置
- 流量限制
- 设备数管理

**核心API**:
- `GET /subscription-plans` - 获取计划列表
- `POST /subscription-plans` - 创建计划
- `PUT /subscription-plans/{planId}` - 更新计划
- `DELETE /subscription-plans/{planId}` - 删除计划

---

### 6. 系统日志模块

**功能描述**: 查看系统操作日志

**核心功能**:
- 日志列表展示
- 日志搜索
- 日志级别筛选
- 时间范围筛选
- 日志详情查看

**核心API**:
- `GET /logs` - 获取日志列表

---

### 7. VPN配置模块

**功能描述**: 管理VPN连接配置

**核心功能**:
- VPN配置CRUD操作
- 协议配置(TCP/UDP)
- 端口配置
- DNS配置
- 加密配置
- 压缩配置
- 配置预览

**核心API**:
- `GET /vpn-configs` - 获取配置列表
- `POST /vpn-configs` - 创建配置
- `PUT /vpn-configs/{configId}` - 更新配置
- `DELETE /vpn-configs/{configId}` - 删除配置

---

### 8. 支付管理模块

**功能描述**: 处理支付相关接口

**核心功能**:
- 创建支付订单
- 支付结果验证
- 支付宝回调处理
- 微信支付回调处理

**核心API**:
- `POST /payment/create` - 创建支付
- `GET /payment/verify` - 验证支付
- `POST /payment/callback/alipay` - 支付宝回调
- `POST /payment/callback/wechat` - 微信支付回调

---

### 9. VPN连接模块

**功能描述**: 管理VPN连接状态

**核心功能**:
- 连接VPN
- 断开VPN
- 查看连接状态
- 查看配置信息
- 获取订阅信息

**核心API**:
- `POST /vpn/connect` - 连接VPN
- `POST /vpn/disconnect` - 断开VPN
- `GET /vpn/status` - 查看状态
- `GET /vpn/config` - 获取配置
- `GET /subscription/my` - 我的订阅

---

## 配置相关信息

### 环境变量配置

**文件**: `.env`

```
VITE_API_BASE_URL=http://localhost:3001/api
```

**说明**:
- `VITE_API_BASE_URL`: API服务器的基础URL
- 默认值: `http://localhost:3000`

### API配置

**文件**: `src/services/api.ts`

```typescript
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});
```

**配置参数**:

| 参数名 | 值 | 说明 |
|-------|---|------|
| baseURL | `VITE_API_BASE_URL` | API基础URL |
| timeout | 30000 | 请求超时时间(30秒) |
| headers | application/json | 内容类型 |
| withCredentials | false | 不携带Cookie |

---

### 认证配置

**Token存储**:
- 使用 `localStorage` 存储Token
- 键名: `token`
- 键名: `user`

**请求头配置**:

```typescript
// 自动添加Token到请求头
Authorization: Bearer {token}
```

**响应拦截器**:

```typescript
// 401错误自动跳转登录页
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

---

## 数据交互模式

### 请求模式

**基础请求结构**:

```typescript
// GET请求
api.get('/endpoint', params)

// POST请求
api.post('/endpoint', data)

// PUT请求
api.put('/endpoint/:id', data)

// DELETE请求
api.delete('/endpoint/:id')
```

**参数格式**:

```typescript
// 查询参数
GET /users?page=1&limit=10&search=test

// 请求体
{
  key1: value1,
  key2: value2
}
```

---

### 响应模式

**成功响应**:

```typescript
{
  success: boolean,
  message: string,
  data: T
}
```

**列表响应**:

```typescript
{
  data: T[],
  total: number,
  page: number,
  limit: number
}
```

**分页响应**:

```typescript
{
  success: boolean,
  message: string,
  data: T
}
```

---

### 错误处理

**错误响应**:

```typescript
{
  success: false,
  message: string,
  error?: string
}
```

**HTTP状态码**:

| 状态码 | 说明 | 处理方式 |
|-------|------|---------|
| 200 | 请求成功 | 正常处理 |
| 400 | 请求参数错误 | 显示错误信息 |
| 401 | 未授权 | 跳转登录 |
| 403 | 无权限 | 提示无权限 |
| 404 | 资源不存在 | 提示资源不存在 |
| 409 | 资源冲突 | 显示冲突信息 |
| 422 | 业务逻辑错误 | 显示具体错误 |
| 500 | 服务器错误 | 提示服务器错误 |

---

## API响应格式规范

### 统一响应格式

#### 1. 成功响应格式

**简单响应**:

```json
{
  "success": true,
  "message": "操作成功"
}
```

**数据响应**:

```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    "key": "value"
  }
}
```

#### 2. 列表响应格式

```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": "string",
      "name": "string",
      // ... 其他字段
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

#### 3. 错误响应格式

```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息(可选)"
}
```

#### 4. 分页响应格式

```json
{
  "success": true,
  "message": "获取成功",
  "data": [
    {
      "id": "string",
      // ... 数据
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 响应字段说明

| 字段名 | 类型 | 说明 |
|-------|------|------|
| success | boolean | 请求是否成功 |
| message | string | 响应消息 |
| data | any | 响应数据 |
| total | number | 总记录数(列表接口) |
| page | number | 当前页码 |
| limit | number | 每页数量 |
| error | string | 错误详情(可选) |

---

### 时间格式规范

**ISO 8601格式**:

```json
"createdAt": "2024-06-11T10:30:00.000Z"
"updatedAt": "2024-06-11T10:30:00.000Z"
```

**本地时间格式**:

```typescript
new Date(dateString).toLocaleString('zh-CN')
```

---

### 数字格式规范

**货币**:

```json
"price": 99.99
"amount": 99.99
```

**百分比**:

```json
"discountRate": 20.00  // 20%
"load": 75.50  // 75.50%
```

**流量**:

```json
"trafficLimit": 1024  // 单位: GB
"bandwidth": 1048576  // 单位: bytes
```

---

### 字符串格式规范

**状态枚举值**:

```json
"status": "active|inactive|pending|error"
"level": "info|warning|error"
```

**类型枚举值**:

```json
"type": "MONTHLY|QUARTERLY|YEARLY|LIFETIME"
"protocol": "tcp|udp"
"paymentMethod": "WALLET|CREDIT_CARD|ALIPAY|WECHAT_PAY"
```

---

## 附录

### API调用示例

#### 登录示例

```typescript
import api from './services/api';

// 登录
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    const { user, accessToken } = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', accessToken);

    return user;
  } catch (error) {
    throw error;
  }
};
```

#### 获取节点列表示例

```typescript
import { useQuery } from '@tanstack/react-query';
import api from './services/api';

// 节点列表
const useNodes = () => {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: () => api.get('/nodes'),
  });
};
```

#### 创建节点示例

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from './services/api';

// 创建节点
const useCreateNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/nodes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
    },
  });
};
```

---

### 错误码对照表

| 错误码 | HTTP状态码 | 说明 |
|-------|-----------|------|
| 1000 | 200 | 请求成功 |
| 1001 | 200 | 操作成功 |
| 2001 | 400 | 请求参数错误 |
| 2002 | 400 | 数据格式错误 |
| 2003 | 400 | 业务逻辑错误 |
| 3001 | 401 | 未授权访问 |
| 3002 | 403 | 无权限访问 |
| 3003 | 404 | 资源不存在 |
| 3004 | 404 | 节点不存在 |
| 3005 | 404 | 订阅计划不存在 |
| 3006 | 404 | 用户不存在 |
| 3007 | 404 | 订单不存在 |
| 4001 | 500 | 服务器内部错误 |
| 4002 | 500 | 数据库错误 |
| 4003 | 500 | 支付服务错误 |

---

### 版本历史

| 版本 | 日期 | 说明 |
|-----|------|------|
| 1.0.0 | 2024-06-11 | 初始版本 |
| 1.1.0 | 2024-06-12 | 新增VPN配置模块 |

---

## 总结

本文档详细描述了VPN服务管理控制台的API接口和数据模型。所有接口都遵循RESTful设计原则，使用统一的响应格式。

### 关键特点

1. **RESTful设计**: 遵循REST架构风格
2. **统一格式**: 统一的请求和响应格式
3. **类型安全**: 完整的TypeScript类型定义
4. **模块化**: 功能模块清晰划分
5. **文档化**: 详细的接口文档

### 维护建议

1. 保持文档与代码同步更新
2. 定期审查接口设计
3. 收集用户反馈优化接口
4. 建立接口测试规范

---

**文档版本**: 1.1.0  
**最后更新**: 2024-06-11  
**维护者**: VPN服务团队