# VPN 管理后台 Dashboard 设计文档

**文档日期**: 2026-06-13
**项目**: VPN 服务管理后台
**技术栈**: HTML5 + CSS3 + Vanilla JavaScript
**文档版本**: 1.0.0

---

## 1. 项目概述

创建一个轻量级的管理后台 Dashboard，用于管理 VPN 服务的核心功能模块。通过纯 HTML/CSS/JavaScript 技术栈，对接后端 NestJS API，提供用户管理、VPN 节点管理、订阅计划管理和订单管理功能。

### 1.1 设计目标

- 简洁易用的用户界面
- 对接现有后端 API 和数据模型
- 轻量级实现，无需构建工具
- 支持通过 Nginx 托管部署
- 提供完整的 CRUD 操作界面

### 1.2 适用场景

- 管理员日常操作
- 数据监控和统计查看
- 快速创建和修改管理内容

---

## 2. 技术架构

### 2.1 前端技术

- **HTML5**: 页面结构和语义化标签
- **CSS3**: 样式和响应式布局
- **Vanilla JavaScript**: 交互逻辑和 API 调用
- **Fetch API**: HTTP 请求和数据获取

### 2.2 后端对接

- **后端框架**: NestJS
- **API 地址**: `http://localhost:3000/api`
- **认证方式**: httpOnly Cookie
- **数据格式**: JSON

### 2.3 部署方式

- 通过 Nginx 托管静态文件
- 配置反向代理
- 支持 HTTPS（可选）

---

## 3. 功能模块

### 3.1 用户登录

**功能描述**:
- 提供登录表单，验证用户凭据
- 使用后端 `/api/auth/login` 接口
- 登录成功后设置 httpOnly Cookie
- 自动跳转到 Dashboard 主界面

**数据模型**:
```typescript
{
  email: string,
  password: string
}
```

**API 接口**:
- `POST /api/auth/login`

**响应格式**:
```json
{
  "code": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "string",
    "user": {
      "id": "string",
      "email": "string",
      "username": "string",
      "subscriptionStatus": "ACTIVE",
      "balance": "number"
    }
  }
}
```

### 3.2 统计概览

**功能描述**:
- 展示关键业务数据统计
- 显示4个核心指标卡片
- 数据来自后端聚合接口

**数据指标**:
1. 用户总数
2. 订单总数
3. 今日收入
4. 在线节点数

**API 接口**:
- `GET /api/stats/overview` (需要自定义)

**响应格式**:
```json
{
  "usersTotal": 0,
  "ordersTotal": 0,
  "todayIncome": 0,
  "onlineNodes": 0
}
```

### 3.3 用户管理

**功能描述**:
- 展示用户列表
- 支持分页和搜索
- 提供创建、编辑、删除用户功能

**数据模型**:
```typescript
{
  id: string,
  email: string,
  username: string,
  subscriptionStatus: string,
  balance: number,
  subscriptionExpiresAt: string,
  createdAt: string
}
```

**API 接口**:
- `GET /api/users?page=1&limit=20&search=keyword`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/users/search?email=xxx`

**UI 功能**:
- 表格展示用户信息
- 搜索框
- 分页控件
- 编辑对话框
- 删除确认

### 3.4 VPN 节点管理

**功能描述**:
- 展示 VPN 节点列表
- 显示节点状态（在线/离线/维护）
- 显示节点延迟和负载
- 支持创建、编辑、删除节点

**数据模型**:
```typescript
{
  id: string,
  name: string,
  region: string,
  ipAddress: string,
  port: number,
  serverAddress: string,
  serverPort: number,
  status: string,
  uptime: number,
  maxConnections: number,
  currentConnections: number,
  delay: number,
  load: number,
  createdAt: string,
  updatedAt: string
}
```

**API 接口**:
- `GET /api/nodes`
- `GET /api/nodes/:id`
- `GET /api/nodes/health`
- `GET /api/nodes/by-region/:region`
- `POST /api/nodes`
- `PUT /api/nodes/:id`
- `DELETE /api/nodes/:id`

**UI 功能**:
- 节点列表表格
- 状态标识（在线/离线）
- 延迟和负载显示
- 健康状态检查

### 3.5 订阅计划管理

**功能描述**:
- 展示订阅套餐列表
- 显示价格、流量、设备数等
- 支持创建、编辑、启用/禁用计划
- 区分计划类型（月度/季度/年度/终身）

**数据模型**:
```typescript
{
  id: string,
  name: string,
  type: string,
  price: number,
  originalPrice: number,
  durationDays: number,
  trafficLimit: number,
  maxDevices: number,
  description: string,
  isActive: boolean,
  discountRate: number,
  refundRate: number,
  createdAt: string,
  updatedAt: string
}
```

**API 接口**:
- `GET /api/subscription-plans`
- `GET /api/subscription-plans/:id`
- `POST /api/subscription-plans`
- `PUT /api/subscription-plans/:id`
- `DELETE /api/subscription-plans/:id`

**UI 功能**:
- 计划卡片列表
- 类型和价格展示
- 启用/禁用开关
- 流量和设备数显示

### 3.6 订单管理

**功能描述**:
- 展示订单列表
- 显示订单状态和金额
- 支持状态筛选
- 查看订单详情

**数据模型**:
```typescript
{
  id: string,
  userId: string,
  orderId: string,
  status: string,
  subscriptionPlanId: string,
  paymentMethod: string,
  totalAmount: number,
  planName: string,
  plan: string,
  paidAmount: number,
  discountAmount: number,
  pointsUsed: number,
  pointsEarned: number,
  paymentTime: string,
  completedTime: string,
  refundTime: string,
  createdAt: string,
  updatedAt: string
}
```

**API 接口**:
- `GET /api/orders`
- `GET /api/orders/:id`

**UI 功能**:
- 订单列表表格
- 状态标签
- 支付方式标识
- 详情查看对话框

---

## 4. 界面设计

### 4.1 整体布局

采用经典的管理后台布局：
- 顶部导航栏
- 侧边栏导航菜单
- 主内容区域

### 4.2 顶部导航栏

- Logo/标题
- 用户信息显示
- 退出登录按钮

### 4.3 侧边栏导航

导航菜单项：
1. 统计概览
2. 用户管理
3. VPN 节点管理
4. 订阅计划管理
5. 订单管理

### 4.4 主内容区域

- 统计概览：4个数字卡片
- 各模块：表格列表 + 操作按钮
- 操作按钮：新建、搜索、筛选、批量操作

### 4.5 响应式设计

- 桌面端：完整布局
- 平板端：调整侧边栏和表格
- 移动端：折叠导航菜单，优化表格显示

---

## 5. 数据流

### 5.1 认证流程

```
用户登录
  → 前端显示登录表单
  → 用户输入 email 和 password
  → POST /api/auth/login
  → 后端验证并设置 httpOnly Cookie
  → 后端返回用户信息
  → 前端保存用户信息到 localStorage
  → 跳转到 Dashboard 主界面
```

### 5.2 数据获取流程

```
用户访问模块
  → 检查登录状态（httpOnly Cookie）
  → 检查权限
  → 显示加载状态
  → GET API 接口
  → 处理响应数据
  → 渲染列表/表格
  → 更新 UI 状态
```

### 5.3 数据操作流程

```
用户点击操作按钮
  → 验证权限
  → 显示操作对话框
  → 用户填写/选择数据
  → 确认操作
  → POST/PUT/DELETE API
  → 刷新列表数据
  → 显示操作结果
```

---

## 6. 错误处理

### 6.1 常见错误

1. **认证失败**: 401 未授权
   - 清除认证信息
   - 跳转到登录页面

2. **权限不足**: 403 禁止访问
   - 显示错误提示
   - 跳转到无权限页面

3. **数据不存在**: 404 未找到
   - 显示友好提示
   - 提供重试选项

4. **服务器错误**: 500 内部错误
   - 显示错误信息
   - 记录错误日志
   - 提供技术支持联系方式

5. **网络错误**: 请求超时/连接失败
   - 检查网络连接
   - 提供重试按钮

### 6.2 错误提示

- 使用 Toast 消息提示
- 显示错误类型和描述
- 提供操作建议
- 不使用原生 alert

---

## 7. 安全考虑

### 7.1 认证安全

- 使用 httpOnly Cookie 存储会话信息
- Token 不暴露在前端 JavaScript 中
- Cookie 配置 HttpOnly 和 Secure 属性（生产环境）
- 退出登录时清除 Cookie

### 7.2 数据安全

- 敏感数据不存储在 localStorage
- 使用 HTTPS 加密传输（生产环境）
- 输入数据验证和清理
- 防止 XSS 攻击

### 7.3 权限控制

- 基于角色的访问控制
- 敏感操作需要认证
- 验证用户权限

---

## 8. 性能优化

### 8.1 代码优化

- 模块化代码结构
- 函数封装和复用
- 避免全局变量污染

### 8.2 网络优化

- 数据缓存（可选）
- 请求去重
- 合并请求（批量操作）

### 8.3 渲染优化

- 延迟加载模块
- 虚拟滚动（大数据量）
- 减少不必要的重渲染

---

## 9. 用户体验

### 9.1 加载状态

- 操作时显示加载指示器
- 等待时间显示进度提示
- 操作完成后显示成功提示

### 9.2 交互反馈

- 按钮点击效果
- 悬停提示
- 操作确认对话框

### 9.3 数据展示

- 清晰的表格布局
- 易读的颜色标识
- 精确的数据格式化

---

## 10. 测试计划

### 10.1 单元测试

- API 封装函数测试
- 工具函数测试
- 状态管理测试

### 10.2 集成测试

- 模块功能测试
- API 对接测试
- 交互流程测试

### 10.3 功能测试

- 用户登录/登出
- CRUD 操作测试
- 数据验证测试

---

## 11. 部署指南

### 11.1 文件结构

```
vpn-service/
└── admin-dashboard/
    ├── index.html
    ├── css/
    │   ├── styles.css
    │   └── responsive.css
    ├── js/
    │   ├── api.js
    │   ├── auth.js
    │   ├── user-management.js
    │   ├── node-management.js
    │   ├── subscription-plan.js
    │   ├── order-management.js
    │   ├── utils.js
    │   └── main.js
    ├── images/
    └── fonts/
```

### 11.2 部署步骤

1. 创建 `admin-dashboard` 目录
2. 复制所有文件到目录
3. 配置 Nginx 反向代理
4. 设置正确的 MIME 类型
5. 配置静态文件访问
6. 配置 HTTPS（可选）

### 11.3 Nginx 配置示例

```nginx
server {
    listen 80;
    server_name admin.example.com;

    location / {
        root /path/to/admin-dashboard;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 12. 依赖说明

### 12.1 前端依赖

- 无外部依赖（纯原生）
- 使用浏览器原生 API
- 无第三方库

### 12.2 后端依赖

- NestJS REST API
- PostgreSQL 数据库
- JWT 认证
- TypeORM

---

## 13. 后续扩展

### 13.1 功能扩展

- 数据导出功能
- 高级搜索和筛选
- 数据统计图表
- 操作日志记录
- 系统设置

### 13.2 技术优化

- 添加单元测试框架
- 引入 CSS 框架（可选）
- 使用构建工具（可选）
- 性能优化

---

## 14. 风险评估

### 14.1 技术风险

- **低风险**: 纯前端技术栈，无复杂依赖
- **低风险**: 与后端 API 接口清晰，易于维护

### 14.2 安全风险

- **低风险**: 使用 httpOnly Cookie，避免 XSS
- **中风险**: 需要配置 HTTPS（生产环境）
- **中风险**: 需要配置防火墙和安全策略

---

## 15. 参考文档

- NestJS 官方文档: https://docs.nestjs.com/
- Fetch API 文档: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- CSS Flexbox: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- Vanilla JavaScript 指南: https://javascript.info/

---

## 16. 审核清单

### 16.1 设计合理性

- [x] 功能需求清晰明确
- [x] 技术选型合适
- [x] 界面布局合理
- [x] 数据流清晰

### 16.2 可实现性

- [x] 与现有后端 API 兼容
- [x] 技术方案可行
- [x] 依赖项明确
- [x] 部署方案清晰

### 16.3 完整性

- [x] 功能描述完整
- [x] 接口定义清晰
- [x] 错误处理完整
- [x] 安全考虑充分

---

**文档结束**

*本设计文档由 AI 助手生成，经过用户审核通过后进入实现阶段。*