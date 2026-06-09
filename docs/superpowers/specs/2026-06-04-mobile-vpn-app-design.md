# 移动端VPN应用设计文档

> 日期：2026-06-04
> 状态：草稿
> 项目：移动端VPN应用

## 1. 项目概述

### 1.1 项目目标

构建一个跨平台移动端VPN应用，支持iOS和Android系统，用户可以通过订阅套餐使用VPN服务，管理后台可以添加和管理V2ray节点。

### 1.2 核心价值

- **简单易用**：一键连接VPN，用户无需技术知识
- **跨平台**：iOS和Android一套代码，同时支持
- **灵活订阅**：多种套餐选择，按需付费
- **节点管理**：管理员可灵活添加和管理节点
- **流量监控**：清晰显示使用情况

### 1.3 功能范围

#### ✅ 包含的功能
- VPN连接/断开
- 节点选择和延迟显示
- 订阅套餐购买和管理
- 流量统计
- 用户认证
- 基本管理后台

#### ❌ 不包含的功能
- 网络共享（热点共享、局域网共享、USB共享）
- 节点优选（自动切换、智能选择）
- 流媒体解锁
- 广告拦截
- DNS保护

---

## 2. 用户角色

### 2.1 普通用户
- 注册登录
- 购买订阅套餐
- 连接VPN节点
- 查看流量统计
- 管理个人订阅

### 2.2 管理员
- 添加/删除/编辑节点
- 查看用户列表
- 管理订单
- 查看统计数据
- 查看系统日志

---

## 3. 功能需求

### 3.1 移动端应用功能

#### 3.1.1 VPN连接功能
- **一键连接**：点击连接按钮即可建立VPN连接
- **一键断开**：点击断开按钮即可断开连接
- **节点选择**：用户可以从节点列表中选择连接的节点
- **连接状态显示**：实时显示VPN连接状态（连接中、已连接、断开）
- **延迟显示**：显示每个节点的延迟值（毫秒）

#### 3.1.2 节点管理功能
- **节点列表**：显示所有可用节点
- **节点筛选**：按地区筛选节点（全部、亚洲、欧美等）
- **节点信息**：显示节点名称、地区、协议类型
- **节点状态**：显示节点在线/离线状态
- **延迟检测**：显示节点的延迟值

#### 3.1.3 订阅管理功能
- **套餐展示**：展示不同套餐的详细信息（名称、价格、时长、流量）
- **套餐购买**：引导用户完成支付流程
- **订阅信息**：查看当前订阅状态、有效期、流量限制
- **订阅续费**：查看即将到期的订阅

#### 3.1.4 流量统计功能
- **使用情况**：显示已用流量和剩余流量
- **流量统计**：统计总流量使用情况
- **连接时间**：显示总连接时间
- **数据可视化**：使用图表展示流量使用情况

#### 3.1.5 用户认证功能
- **注册**：新用户注册账号
- **登录**：已注册用户登录
- **密码重置**：忘记密码时重置密码
- **个人信息**：查看和编辑个人信息

#### 3.1.6 设置功能
- **连接设置**：VPN连接相关设置
- **通知设置**：推送通知设置
- **关于信息**：应用版本、开发者信息
- **用户协议和隐私政策**：查看相关协议

### 3.2 管理后台功能

#### 3.2.1 节点管理
- **添加节点**：输入节点信息添加新节点
- **编辑节点**：修改节点配置信息
- **删除节点**：移除节点
- **节点状态**：查看节点在线/离线状态
- **节点延迟**：查看节点延迟情况

#### 3.2.2 用户管理
- **用户列表**：查看所有用户信息
- **用户详情**：查看用户详细信息
- **用户状态**：查看用户订阅状态

#### 3.2.3 订单管理
- **订单列表**：查看所有订单
- **订单详情**：查看订单详细信息
- **订单状态**：查看订单支付状态

#### 3.2.4 套餐管理
- **添加套餐**：创建新的订阅套餐
- **编辑套餐**：修改套餐信息
- **删除套餐**：移除套餐

#### 3.2.5 统计分析
- **用户统计**：用户数量、增长率
- **流量统计**：总流量使用情况
- **收入统计**：总收入、收入来源
- **订单统计**：订单数量、成功率

#### 3.2.6 日志系统
- **系统日志**：系统运行日志
- **错误日志**：系统错误信息
- **操作日志**：管理员操作记录

### 3.3 支付功能
- **支付集成**：集成主流支付方式（支付宝、微信支付）
- **支付回调**：处理支付结果通知
- **订单管理**：订单状态更新和查询

---

## 4. 技术架构

### 4.1 系统架构图

```
┌──────────────────────────────────────────────────────────┐
│                    移动端 VPN 应用                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │   iOS App   │  │ Android App │  │  管理后台 Web   │  │
│  │  (React)    │  │  (React)    │  │  (NestJS/React)│  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬───────┘  │
└─────────┼────────────────┼──────────────────┼──────────┘
          │                │                  │
          └────────────────┼──────────────────┘
                           │ HTTPS
          ┌────────────────▼───────────────────┐
          │          VPN 服务 API              │
          │        (NestJS 后端)               │
          │  ┌────┬────┬────┬────┬────┬────┐   │
          │  │Auth│User│Plan│Order│Node│Admin│  │
          │  └────┴────┴────┴────┴────┴────┘   │
          └──────┬────────────────┬────────────┘
                 │                │
         ┌───────▼──────┐  ┌─────▼──────┐
         │ PostgreSQL  │  │   Redis    │
         │ (数据持久化)  │  │ (缓存/订阅) │
         └──────────────┘  └────────────┘
```

### 4.2 技术栈选择

| 层级 | 技术选择 | 说明 |
|------|----------|------|
| 移动端 | React Native | 跨平台，一套代码支持iOS和Android |
| 管理后台 | NestJS + Ant Design | 现代化技术栈，与用户端API一致 |
| VPN核心 | v2ray-core / Xray-core | 支持VLESS、VMess、Trojan等协议 |
| 数据库 | PostgreSQL | 关系型数据库，数据持久化 |
| 缓存 | Redis | 会话缓存、订阅缓存 |
| 部署 | Docker Compose | 容器化部署，简化运维 |
| 支付 | 支付宝 + 微信支付 | 国内主流支付方式 |

### 4.3 协议支持

- **VLESS WebSocket**：主要协议，轻量高效
- **VMess**：V2ray经典协议
- **Trojan**：伪装成HTTPS流量
- **Reality**：抗审查协议

### 4.4 数据流向

```
用户操作 → 前端API请求 → 后端API处理 → 数据库操作 → 返回结果 → 更新UI
    ↓            ↓              ↓              ↓            ↓
  选择节点    保存连接信息    检查订阅状态    读取节点数据    显示状态
```

---

## 5. 数据模型

### 5.1 用户表 (users)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0.00,
  subscription_expire_at TIMESTAMP,
  traffic_used BIGINT DEFAULT 0,
  traffic_limit BIGINT DEFAULT 0,
  subscription_plan_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_expire_at);
```

### 5.2 套餐表 (subscription_plans)

```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  duration_days INT NOT NULL,
  monthly_traffic BIGINT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_active TINYINT DEFAULT 1,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_active ON subscription_plans(is_active);
```

### 5.3 订单表 (orders)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  pay_url VARCHAR(500),
  paid_at TIMESTAMP,
  payment_transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### 5.4 节点表 (nodes)

```sql
CREATE TABLE nodes (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100) NOT NULL,
  protocol VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  port INT NOT NULL,
  path VARCHAR(255),
  server_name VARCHAR(255),
  delay INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'online',
  is_free TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_nodes_status ON nodes(status);
CREATE INDEX idx_nodes_region ON nodes(region);
CREATE INDEX idx_nodes_delay ON nodes(delay);
```

### 5.5 订阅表 (user_subscriptions)

```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  traffic_used BIGINT DEFAULT 0,
  traffic_limit BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON user_subscriptions(status);
```

### 5.6 连接记录表 (connection_logs)

```sql
CREATE TABLE connection_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  node_id UUID NOT NULL,
  connect_at TIMESTAMP NOT NULL,
  disconnect_at TIMESTAMP,
  duration_seconds INT DEFAULT 0,
  traffic_bytes BIGINT DEFAULT 0,
  status VARCHAR(50)
);

CREATE INDEX idx_logs_user ON connection_logs(user_id);
CREATE INDEX idx_logs_connect_time ON connection_logs(connect_at);
```

### 5.7 日志表 (system_logs)

```sql
CREATE TABLE system_logs (
  id UUID PRIMARY KEY,
  level VARCHAR(20) DEFAULT 'info',
  message TEXT NOT NULL,
  error_code VARCHAR(100),
  user_id UUID,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_level ON system_logs(level);
CREATE INDEX idx_logs_created_at ON system_logs(created_at);
```

---

## 6. API设计

### 6.1 认证接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | /api/auth/register | 注册 | 公开 |
| POST | /api/auth/login | 登录 | 公开 |
| POST | /api/auth/refresh | 刷新token | 公开 |
| POST | /api/auth/logout | 登出 | 用户 |
| GET | /api/auth/profile | 用户信息 | 用户 |

### 6.2 订阅接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /api/subscription/plans | 套餐列表 | 公开 |
| GET | /api/subscription/my | 我的订阅 | 用户 |
| POST | /api/subscription/purchase | 购买订阅 | 用户 |
| GET | /api/subscription/info | 订阅信息 | 用户 |

### 6.3 节点接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /api/nodes | 节点列表 | 公开 |
| GET | /api/nodes/:id | 节点详情 | 公开 |
| POST | /api/nodes | 添加节点 | 管理员 |

### 6.4 连接接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | /api/vpn/connect | 建立VPN连接 | 用户 |
| POST | /api/vpn/disconnect | 断开VPN连接 | 用户 |
| GET | /api/vpn/status | VPN状态 | 用户 |
| GET | /api/vpn/config | VPN配置 | 用户 |

### 6.5 订单接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /api/orders | 订单列表 | 用户 |
| GET | /api/orders/:id | 订单详情 | 用户 |
| POST | /api/payment/callback | 支付回调 | 内部 |

### 6.6 用户接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /api/user/traffic | 流量统计 | 用户 |
| PUT | /api/user/profile | 更新个人信息 | 用户 |
| PUT | /api/user/password | 修改密码 | 用户 |

### 6.7 管理接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | /api/admin/stats | 数据统计 | 管理员 |
| GET | /api/admin/users | 用户列表 | 管理员 |
| GET | /api/admin/users/:id | 用户详情 | 管理员 |
| GET | /api/admin/nodes | 节点列表 | 管理员 |
| POST | /api/admin/nodes | 添加节点 | 管理员 |
| PUT | /api/admin/nodes/:id | 编辑节点 | 管理员 |
| DELETE | /api/admin/nodes/:id | 删除节点 | 管理员 |
| GET | /api/admin/orders | 订单列表 | 管理员 |
| GET | /api/admin/logs | 日志列表 | 管理员 |

---

## 7. UI/UX设计

### 7.1 移动端应用界面

#### 主界面 (Main Screen)
- 顶部：应用标题/Logo
- 快速操作：连接/断开按钮
- 节点列表：显示所有可用节点
- 筛选功能：按地区筛选
- 流量统计：显示使用情况
- 底部导航：主要功能入口

#### 节点列表界面 (Node List)
- 返回按钮
- 筛选标签
- 节点卡片列表
- 节点状态指示
- 延迟显示

#### 订阅页面 (Subscription)
- 套餐卡片列表
- 价格、时长、流量信息
- 购买按钮
- 订阅信息展示

#### 个人中心 (Profile)
- 用户信息
- 订阅信息
- 流量统计
- 设置入口
- 退出登录

#### 支付页面 (Payment)
- 订单确认
- 支付方式选择
- 支付按钮
- 支付结果页

#### 管理后台界面 (Admin Dashboard)
- 侧边导航栏
- 数据统计卡片
- 功能模块入口
- 数据表格列表

### 7.2 设计规范

- **主色调**：蓝色系
- **字体**：无衬线字体
- **圆角**：8-16px
- **间距**：8px基础间距
- **阴影**：轻微阴影提升层次感

---

## 8. 安全设计

### 8.1 认证安全

- **JWT Token**：Access Token有效期2小时，Refresh Token有效期7天
- **密码加密**：使用bcrypt加密存储
- **登录限制**：5次失败/15分钟

### 8.2 订阅安全

- **随机Token**：订阅链接使用64位随机token
- **IP绑定**：可选IP绑定功能
- **流量限制**：超限自动断开

### 8.3 支付安全

- **回调验签**：支付宝RSA、微信HMAC签名验证
- **金额校验**：订单金额二次校验
- **幂等处理**：防止重复回调

### 8.4 接口安全

- **JWT中间件**：保护所有API
- **权限控制**：管理员接口权限验证
- **频率限制**：防止接口滥用

---

## 9. 部署方案

### 9.1 Docker Compose部署

```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=vpn_db
      - POSTGRES_USER=vpn_user
      - POSTGRES_PASSWORD=vpn_password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### 9.2 环境要求

- **服务器**：Linux操作系统，至少2核4G内存
- **Docker**：Docker 20.10+
- **Docker Compose**：1.29+
- **域名**：已配置SSL证书
- **支付账号**：支付宝/微信支付商户账号

### 9.3 数据备份

- 数据库自动备份（每日）
- 备份文件存储到云存储
- 保留最近30天备份

---

## 10. 开发计划

### 10.1 Phase 1：基础框架搭建（1-2周）

#### 任务清单：
- [ ] 项目初始化和目录结构搭建
- [ ] React Native项目配置
- [ ] NestJS后端项目初始化
- [ ] 数据库设计和技术栈配置
- [ ] 基础UI框架搭建
- [ ] 认证模块开发
- [ ] 基础API接口开发

#### 交付物：
- 可运行的项目框架
- 基础认证功能
- API接口文档

### 10.2 Phase 2：核心功能开发（2-3周）

#### 任务清单：
- [ ] 节点管理功能开发
- [ ] VPN连接核心功能
- [ ] 节点列表和筛选
- [ ] 延迟检测功能
- [ ] 连接日志记录

#### 交付物：
- 完整的节点管理功能
- VPN连接功能
- 延迟检测功能

### 10.3 Phase 3：订阅和支付（2-3周）

#### 任务清单：
- [ ] 套餐管理功能
- [ ] 订单系统开发
- [ ] 支付集成（支付宝、微信）
- [ ] 订阅管理功能
- [ ] 流量统计功能
- [ ] 个人中心功能

#### 交付物：
- 完整的订阅系统
- 支付功能
- 流量统计

### 10.4 Phase 4：管理后台（2-3周）

#### 任务清单：
- [ ] 管理后台框架搭建
- [ ] 节点管理界面
- [ ] 用户管理界面
- [ ] 订单管理界面
- [ ] 统计分析界面
- [ ] 日志查看功能

#### 交付物：
- 完整的管理后台
- 数据统计功能

### 10.5 Phase 5：测试和优化（1-2周）

#### 任务清单：
- [ ] 功能测试
- [ ] 性能优化
- [ ] 安全测试
- [ ] UI/UX优化
- [ ] Bug修复

#### 交付物：
- 测试报告
- 优化后的系统
- 用户手册

---

## 11. 风险和挑战

### 11.1 技术风险

- **VPN协议兼容性**：不同协议可能存在兼容性问题
- **跨平台性能**：React Native在VPN功能上的性能表现
- **延迟检测**：准确检测节点延迟的技术挑战

### 11.2 运营风险

- **节点维护**：节点稳定性和可用性
- **支付渠道**：支付渠道政策和费率
- **用户增长**：获取新用户的挑战

### 11.3 法律风险

- **合规性**：VPN服务的法律合规性
- **数据隐私**：用户数据的保护
- **跨境服务**：跨境运营的挑战

---

## 12. 成功指标

### 12.1 技术指标

- 应用加载时间 < 2秒
- VPN连接成功率 > 95%
- 节点延迟 < 300ms（平均）
- API响应时间 < 500ms

### 12.2 用户指标

- 日活用户数
- 用户留存率
- 平均会话时长
- 流量使用情况

### 12.3 业务指标

- 订阅转化率
- 用户满意度
- 系统可用性 > 99%

---

## 13. 后续扩展

### 13.1 功能扩展

- 多语言支持
- 主题切换
- 离线连接
- 节点自定义

### 13.2 体验优化

- 节点推荐
- 流量预测
- 智能提醒

### 13.3 商业拓展

- 新套餐类型
- 优惠券系统
- 推荐奖励

---

## 14. 附录

### 14.1 术语表

- **VPN**：虚拟专用网络
- **VLESS**：V2ray轻量级协议
- **WebSocket**：全双工通信协议
- **JWT**：JSON Web Token

### 14.2 参考资源

- React Native官方文档
- NestJS官方文档
- v2ray-core文档
- PostgreSQL文档
- Docker文档

### 14.3 联系方式

项目负责人：[待填写]
技术支持：[待填写]
商务合作：[待填写]

---

## 审批记录

| 角色 | 姓名 | 日期 | 状态 | 签名 |
|------|------|------|------|------|
| 产品经理 | | | | |
| 技术负责人 | | | | |
| 开发团队 | | | | |
| 测试团队 | | | | |