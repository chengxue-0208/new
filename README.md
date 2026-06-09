# VPN 服务

> 一个功能完整的VPN服务系统，支持iOS和Android移动端应用，提供节点管理、订阅套餐、支付集成和流量统计等功能。

## 📋 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [API文档](#api文档)
- [部署指南](#部署指南)
- [配置说明](#配置说明)

---

## ✨ 功能特性

### 后端服务

- ✅ 用户认证与授权 (JWT)
- ✅ VPN节点管理 (VLESS、VMess、Trojan等协议)
- ✅ 节点延迟检测
- ✅ VPN连接与断开
- ✅ 订阅套餐管理
- ✅ 订单系统
- ✅ 支付集成 (支付宝、微信支付)
- ✅ 流量统计与监控
- ✅ 连接日志记录
- ✅ 管理后台功能
- ✅ 系统日志管理

### 移动端应用

- ✅ 用户注册与登录
- ✅ VPN连接/断开
- ✅ 节点选择与延迟显示
- ✅ 订阅套餐购买
- ✅ 流量统计查看
- ✅ 个人中心
- ✅ 支付集成
- ✅ 订单管理

### 管理后台

- ✅ 数据统计
- ✅ 用户管理
- ✅ 节点管理
- ✅ 订单管理
- ✅ 订阅套餐管理
- ✅ 日志查看与删除

---

## 🛠 技术栈

### 后端

- **框架**: NestJS ^10.0.0
- **数据库**: PostgreSQL ^14
- **缓存**: Redis ^7
- **ORM**: TypeORM ^0.3.0
- **认证**: Passport + JWT
- **支付**: 支付宝 + 微信支付
- **开发工具**: TypeScript, ESLint

### 移动端

- **框架**: React Native ^0.72.0
- **导航**: @react-navigation/native
- **UI库**: React Native Paper
- **状态管理**: React Hooks
- **网络**: Axios
- **存储**: @react-native-async-storage/async-storage

### 管理后台

- **框架**: NestJS ^10.0.0
- **UI库**: (待选择)
- **开发工具**: TypeScript, ESLint

### 部署

- **容器化**: Docker
- **编排**: Docker Compose
- **反向代理**: Nginx (可选)

---

## 📁 项目结构

```
vpn-service/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── auth/              # 认证模块
│   │   ├── user/              # 用户模块
│   │   ├── subscription/      # 订阅模块
│   │   ├── order/             # 订单模块
│   │   ├── node/              # 节点模块
│   │   ├── vpn/               # VPN配置模块
│   │   ├── payment/           # 支付模块
│   │   ├── admin/             # 管理模块
│   │   ├── entities/          # 数据库实体
│   │   ├── common/            # 公共模块
│   │   └── main.ts
│   ├── prisma/                # 数据库模型
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── admin-web/                  # 管理后台
│   ├── src/
│   │   ├── admin/
│   │   ├── auth/
│   │   └── app.module.ts
│   ├── Dockerfile
│   └── package.json
├── client-mobile/              # 移动端应用
│   ├── android/
│   ├── ios/
│   ├── src/
│   │   ├── navigation/        # 导航
│   │   ├── screens/           # 页面
│   │   ├── services/          # API服务
│   │   └── theme/             # 主题
│   └── package.json
├── docs/
│   ├── api/                   # API文档
│   └── superpowers/           # 文档目录
├── docker-compose.yml
└── start-backend.sh
```

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Redis >= 7
- Docker >= 20.10 (可选)

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd vpn-service
```

2. **安装后端依赖**

```bash
cd backend
npm install
```

3. **安装移动端依赖**

```bash
cd ../client-mobile
npm install
```

4. **安装管理后台依赖**

```bash
cd ../admin-web
npm install
```

5. **配置环境变量**

```bash
# 后端环境变量
cp backend/.env.example backend/.env

# 编辑backend/.env，填入必要的配置
```

6. **启动数据库服务**

```bash
# 使用Docker Compose启动数据库
docker-compose up -d postgres redis
```

7. **运行数据库迁移**

```bash
cd backend
npx typeorm migration:run
```

8. **运行数据库种子**

```bash
npx ts-node seed.ts
```

9. **启动后端服务**

```bash
cd backend
npm run dev
```

10. **启动移动端应用**

```bash
cd client-mobile
npm run ios  # iOS
npm run android  # Android
```

11. **启动管理后台**

```bash
cd admin-web
npm run dev
```

---

## 📚 API文档

详细的API文档请查看：[API文档](./docs/api/vpn-service-api-docs.md)

主要接口包括：

- 认证接口: `/api/auth`
- 节点管理: `/api/nodes`
- VPN连接: `/api/vpn`
- 订阅管理: `/api/subscription`
- 订单管理: `/api/orders`
- 用户管理: `/api/user`
- 支付功能: `/api/payment`
- 管理功能: `/api/admin`

---

## 🏗 部署指南

### 使用Docker Compose部署

1. **构建镜像**

```bash
docker-compose build
```

2. **启动服务**

```bash
docker-compose up -d
```

3. **查看日志**

```bash
docker-compose logs -f
```

4. **停止服务**

```bash
docker-compose down
```

### 生产环境部署

1. **构建生产镜像**

```bash
docker-compose -f docker-compose.prod.yml build
```

2. **部署服务**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **配置Nginx**

参考 `nginx.conf` 配置文件。

### 环境变量配置

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| DATABASE_URL | 数据库连接字符串 | - | ✅ |
| REDIS_URL | Redis连接字符串 | - | ✅ |
| JWT_SECRET | JWT密钥 | - | ✅ |
| ALIPAY_APP_ID | 支付宝应用ID | - | ⚠️ |
| ALIPAY_PRIVATE_KEY | 支付宝私钥 | - | ⚠️ |
| ALIPAY_PUBLIC_KEY | 支付宝公钥 | - | ⚠️ |
| WECHAT_PAY_APP_ID | 微信支付应用ID | - | ⚠️ |
| WECHAT_PAY_MCH_ID | 微信支付商户ID | - | ⚠️ |
| WECHAT_PAY_API_KEY | 微信支付API密钥 | - | ⚠️ |
| BASE_URL | 应用基础URL | http://localhost:3000 | ✅ |
| NODE_ENV | 运行环境 | development | ✅ |

---

## ⚙️ 配置说明

### 数据库配置

使用PostgreSQL作为主要数据库：

- 数据库名: `vpn_db`
- 用户: `vpn_user`
- 密码: `vpn_password`

### Redis配置

用于缓存和会话管理：

- 端口: `6379`
- 连接字符串: `redis://localhost:6379`

### 支付配置

支持支付宝和微信支付：

- 需要申请相应的支付平台开发者账号
- 配置API密钥和商户信息
- 配置回调URL

### 认证配置

使用JWT进行用户认证：

- Access Token有效期: 2小时
- Secret密钥需要在`.env`中配置

---

## 🔐 安全建议

1. **生产环境配置**
   - 使用强密码
   - 修改默认JWT密钥
   - 配置HTTPS
   - 启用数据库密码认证

2. **支付安全**
   - 配置正确的支付平台密钥
   - 验证支付回调
   - 防止重放攻击

3. **数据安全**
   - 定期备份数据库
   - 敏感数据加密存储
   - 日志脱敏处理

---

## 📖 相关文档

- [API文档](./docs/api/vpn-service-api-docs.md)
- [设计文档](./docs/superpowers/specs/2026-06-04-mobile-vpn-app-design.md)
- [实施计划](./docs/superpowers/plans/2026-06-04-mobile-vpn-app-plan.md)
- [技术栈文档](./docs/superpowers/tech-stack.md)

---

## 🤝 贡献指南

欢迎贡献代码！请查看我们的贡献指南。

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

---

## 📞 联系方式

- 项目负责人: [待填写]
- 技术支持: [待填写]
- 商务合作: [待填写]

---

## 🙏 致谢

感谢以下开源项目：

- NestJS
- React Native
- PostgreSQL
- Redis
- TypeORM

---

## 🔄 更新日志

### v1.0.0 (2026-06-09)

- ✨ 初始版本发布
- ✨ 实现完整的VPN服务系统
- ✨ 支持iOS和Android移动端
- ✨ 集成支付宝和微信支付
- ✨ 完善管理后台功能
- ✨ 提供详细的API文档

---

**Enjoy!** 🎉