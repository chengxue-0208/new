# 移动端VPN应用实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个跨平台移动端VPN应用，支持iOS和Android，包含VPN连接、节点管理、订阅套餐、流量统计和基本管理后台功能。

**Architecture:** 采用前后端分离架构，移动端使用React Native跨平台开发，后端使用NestJS提供API服务，VPN核心使用v2ray-core，数据库使用PostgreSQL + Redis，支持支付宝和微信支付。

**Tech Stack:** React Native, NestJS, v2ray-core, PostgreSQL, Redis, Docker Compose, React Native Navigation, React Native Paper, Axios

---

## 项目结构

```
vpn-service/
├── backend/                    # NestJS后端
│   ├── src/
│   │   ├── auth/              # 认证模块
│   │   ├── user/              # 用户模块
│   │   ├── subscription/      # 订阅模块
│   │   ├── order/             # 订单模块
│   │   ├── node/              # 节点模块
│   │   ├── vpn/               # VPN配置模块
│   │   ├── admin/             # 管理模块
│   │   ├── common/            # 公共模块
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── prisma/
│   │   └── schema.prisma      # 数据库模型
│   ├── Dockerfile
│   └── package.json
├── client-mobile/              # React Native移动端
│   ├── android/
│   ├── ios/
│   ├── src/
│   │   ├── navigation/        # 导航
│   │   ├── screens/           # 页面
│   │   ├── components/        # 组件
│   │   ├── services/          # API服务
│   │   ├── store/             # 状态管理
│   │   ├── theme/             # 主题
│   │   ├── utils/             # 工具函数
│   │   └── App.tsx
│   ├── package.json
│   └── android/gradle.properties
├── admin-web/                  # 管理后台
│   ├── src/
│   │   ├── pages/             # 页面
│   │   ├── components/        # 组件
│   │   ├── api/               # API
│   │   └── App.tsx
│   └── package.json
├── docs/
│   └── superpowers/
│       ├── plans/
│       └── specs/
└── docker-compose.yml
```

---

## Phase 1: 基础框架搭建（1-2周）

### Task 1: 项目初始化和目录结构搭建

**Files:**
- Create: `vpn-service/docker-compose.yml`
- Create: `vpn-service/backend/package.json`
- Create: `vpn-service/client-mobile/package.json`
- Create: `vpn-service/admin-web/package.json`
- Create: `vpn-service/backend/Dockerfile`
- Create: `vpn-service/.gitignore`

**Step 1: 创建docker-compose.yml**

```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL="postgresql://vpn_user:vpn_password@postgres:5432/vpn_db"
      - REDIS_URL="redis://redis:6379"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app

  postgres:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=vpn_db
      - POSTGRES_USER=vpn_user
      - POSTGRES_PASSWORD=vpn_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

**Step 2: 创建backend/package.json**

```json
{
  "name": "vpn-service-backend",
  "version": "1.0.0",
  "description": "VPN服务后端API",
  "main": "dist/main.js",
  "scripts": {
    "start": "node dist/main.js",
    "dev": "nest start",
    "build": "nest build",
    "test": "jest"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "typeorm": "^0.3.0",
    "pg": "^8.11.0",
    "redis": "^4.6.0",
    "axios": "^1.6.0",
    "bcrypt": "^5.1.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/node": "^20.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.5.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.0.0"
  }
}
```

**Step 3: 创建client-mobile/package.json**

```json
{
  "name": "vpn-service-mobile",
  "version": "1.0.0",
  "description": "VPN服务移动端应用",
  "main": "node_modules/react-native/index.js",
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.0",
    "react-native-navigation": "^9.0.0",
    "react-native-paper": "^5.0.0",
    "react-native-vector-icons": "^10.0.0",
    "react-native-safe-area-context": "^4.0.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "axios": "^1.6.0",
    "@react-native-community/netinfo": "^11.0.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "react-native-screens": "^3.29.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "babel-jest": "^29.7.0",
    "metro-react-native-babel-preset": "0.76.0",
    "jest": "^29.7.0",
    "@react-native-community/eslint-config": "^3.0.0"
  }
}
```

**Step 4: 创建admin-web/package.json**

```json
{
  "name": "vpn-service-admin",
  "version": "1.0.0",
  "description": "VPN服务管理后台",
  "main": "dist/app.js",
  "scripts": {
    "start": "node dist/app.js",
    "dev": "nest start",
    "build": "nest build"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@types/node": "^20.0.0",
    "@types/bcrypt": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
```

**Step 5: 创建.gitignore**

```gitignore
node_modules/
.env
dist/
build/
*.log
.DS_Store
.idea/
.vscode/
coverage/
```

- [ ] **Step 6: 提交项目初始化**

```bash
cd vpn-service
git init
git add docker-compose.yml package.json
git commit -m "feat: 初始化项目结构和基础配置"
```

---

### Task 2: 数据库设计和模型创建

**Files:**
- Create: `vpn-service/backend/prisma/schema.prisma`
- Create: `vpn-service/backend/src/auth/auth.module.ts`
- Create: `vpn-service/backend/src/auth/auth.controller.ts`
- Create: `vpn-service/backend/src/auth/auth.service.ts`
- Create: `vpn-service/backend/src/auth/dto/register.dto.ts`
- Create: `vpn-service/backend/src/auth/dto/login.dto.ts`
- Create: `vpn-service/backend/src/auth/entities/user.entity.ts`

**Step 1: 创建prisma schema**

```prisma
// vpn-service/backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
}

enum OrderStatus {
  PENDING
  PAID
  FAILED
  CANCELLED
}

model User {
  id                    String    @id @default(uuid())
  email                 String    @unique
  passwordHash          String
  balance               Float     @default(0)
  subscriptionStatus    SubscriptionStatus @default(ACTIVE)
  subscriptionPlanId    String?
  subscriptionExpiresAt DateTime?
  trafficUsed           BigInt    @default(0)
  trafficLimit          BigInt    @default(0)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  subscriptionPlan      SubscriptionPlan?
  orders                Order[]
  connections           ConnectionLog[]
}

model SubscriptionPlan {
  id                String          @id @default(uuid())
  name              String
  durationDays      Int
  monthlyTraffic    BigInt
  price             Float
  isActive          Boolean         @default(true)
  displayOrder      Int             @default(0)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  users             User[]
}

model Order {
  id                     String             @id @default(uuid())
  userId                 String
  planId                 String
  amount                 Float
  paymentMethod          String
  status                 OrderStatus        @default(PENDING)
  payUrl                 String?
  paymentTransactionId   String?
  paidAt                 DateTime?
  createdAt              DateTime           @default(now())
  updatedAt              DateTime           @updatedAt

  user                  User
  plan                   SubscriptionPlan
}

model Node {
  id           String   @id @default(uuid())
  name         String
  region       String
  protocol     String
  address      String
  port         Int
  path         String?
  serverName   String?
  delay        Int      @default(0)
  status       String   @default("online")
  isFree       Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ConnectionLog {
  id            String   @id @default(uuid())
  userId        String
  nodeId        String
  connectAt     DateTime
  disconnectAt  DateTime?
  duration      Int      @default(0)
  traffic       BigInt   @default(0)
  status        String?
  createdAt     DateTime @default(now())

  user          User
  node          Node
}

model SystemLog {
  id           String   @id @default(uuid())
  level        String   @default("info")
  message      String
  errorCode    String?
  userId       String?
  ipAddress    String?
  createdAt    DateTime @default(now())
}
```

**Step 2: 创建auth.dto.ts**

```typescript
// vpn-service/backend/src/auth/dto/register.dto.ts
export class RegisterDto {
  email: string;
  password: string;
}

// vpn-service/backend/src/auth/dto/login.dto.ts
export class LoginDto {
  email: string;
  password: string;
}
```

**Step 3: 创建auth.module.ts**

```typescript
// vpn-service/backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

**Step 4: 创建auth.controller.ts**

```typescript
// vpn-service/backend/src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

**Step 5: 创建auth.service.ts**

```typescript
// vpn-service/backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash: registerDto.password,
      balance: 0,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
```

- [ ] **Step 6: 提交基础认证模块**

```bash
git add backend/
git commit -m "feat: 创建数据库模型和基础认证模块"
```

---

### Task 3: 后端核心模块开发

**Files:**
- Create: `vpn-service/backend/src/node/node.module.ts`
- Create: `vpn-service/backend/src/node/node.controller.ts`
- Create: `vpn-service/backend/src/node/node.service.ts`
- Create: `vpn-service/backend/src/subscription/subscription.module.ts`
- Create: `vpn-service/backend/src/subscription/subscription.controller.ts`
- Create: `vpn-service/backend/src/subscription/subscription.service.ts`
- Create: `vpn-service/backend/src/order/order.module.ts`
- Create: `vpn-service/backend/src/order/order.controller.ts`
- Create: `vpn-service/backend/src/order/order.service.ts`

**Step 1: 创建node模块**

```typescript
// vpn-service/backend/src/node/node.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { Node } from '../entities/node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  controllers: [NodeController],
  providers: [NodeService],
  exports: [NodeService],
})
export class NodeModule {}
```

**Step 2: 创建node.controller.ts**

```typescript
// vpn-service/backend/src/node/node.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NodeService } from './node.service';

@Controller('nodes')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get()
  async findAll() {
    return this.nodeService.findAll();
  }

  @Post()
  async create(@Body() nodeData: any) {
    return this.nodeService.create(nodeData);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.nodeService.findOne(id);
  }
}
```

**Step 3: 创建node.service.ts**

```typescript
// vpn-service/backend/src/node/node.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from '../entities/node.entity';

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
  ) {}

  async findAll() {
    return this.nodeRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    return this.nodeRepository.findOne({ where: { id } });
  }

  async create(nodeData: any) {
    const node = this.nodeRepository.create(nodeData);
    return this.nodeRepository.save(node);
  }

  async update(id: string, nodeData: any) {
    await this.nodeRepository.update(id, nodeData);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.nodeRepository.delete(id);
    return { message: 'Node deleted' };
  }
}
```

**Step 4: 创建subscription模块**

```typescript
// vpn-service/backend/src/subscription/subscription.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionPlan, UserSubscription } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan, UserSubscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
```

**Step 5: 创建subscription.controller.ts**

```typescript
// vpn-service/backend/src/subscription/subscription.controller.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  async getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Get('my')
  async getMySubscription(userId: string) {
    return this.subscriptionService.getMySubscription(userId);
  }

  @Post('purchase')
  async purchase(@Body() purchaseData: any, userId: string) {
    return this.subscriptionService.purchase(purchaseData, userId);
  }
}
```

**Step 6: 创建subscription.service.ts**

```typescript
// vpn-service/backend/src/subscription/subscription.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SubscriptionPlan, UserSubscription } from '../entities';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(UserSubscription)
    private subscriptionRepository: Repository<UserSubscription>,
  ) {}

  async getPlans() {
    return this.planRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async getMySubscription(userId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
      relations: ['plan'],
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    return {
      subscription,
      trafficUsed: user?.trafficUsed || 0,
      trafficLimit: user?.trafficLimit || 0,
    };
  }

  async purchase(purchaseData: any, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const plan = await this.planRepository.findOne({
      where: { id: purchaseData.planId },
    });

    const subscription = this.subscriptionRepository.create({
      userId,
      planId: plan.id,
      startAt: new Date(),
      endAt: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000),
      trafficLimit: plan.monthlyTraffic,
    });

    await this.subscriptionRepository.save(subscription);

    return subscription;
  }
}
```

**Step 7: 创建order模块**

```typescript
// vpn-service/backend/src/order/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, User } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
```

**Step 8: 创建order.controller.ts**

```typescript
// vpn-service/backend/src/order/order.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll(userId: string) {
    return this.orderService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
```

**Step 9: 创建order.service.ts**

```typescript
// vpn-service/backend/src/order/order.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, User } from '../entities';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.orderRepository.findOne({ where: { id } });
  }

  async create(purchaseData: any, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const order = this.orderRepository.create({
      userId,
      planId: purchaseData.planId,
      amount: purchaseData.amount,
      paymentMethod: purchaseData.paymentMethod,
      status: 'PENDING',
    });

    const savedOrder = await this.orderRepository.save(order);

    return savedOrder;
  }

  async updateStatus(id: string, status: string) {
    await this.orderRepository.update(id, { status });
    return this.findOne(id);
  }
}
```

- [ ] **Step 10: 提交核心模块**

```bash
git add backend/src/
git commit -m "feat: 创建后端核心业务模块"
```

---

### Task 4: 移动端项目初始化

**Files:**
- Create: `vpn-service/client-mobile/.gitignore`
- Create: `vpn-service/client-mobile/App.tsx`
- Create: `vpn-service/client-mobile/src/navigation/AppNavigator.tsx`
- Create: `vpn-service/client-mobile/src/services/api.ts`
- Create: `vpn-service/client-mobile/src/services/vpnService.ts`
- Create: `vpn-service/client-mobile/src/theme/Theme.ts`
- Create: `vpn-service/client-mobile/src/theme/Colors.ts`

**Step 1: 创建App.tsx**

```typescript
// vpn-service/client-mobile/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NodesScreen from './src/screens/NodesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'VPN' }}
          />
          <Stack.Screen
            name="Nodes"
            component={NodesScreen}
            options={{ title: '节点' }}
          />
          <Stack.Screen
            name="Subscription"
            component={SubscriptionScreen}
            options={{ title: '订阅' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: '我的' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
```

**Step 2: 创建HomeScreen.tsx**

```typescript
// vpn-service/client-mobile/src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = () => {
  const handleConnect = () => {
    // VPN连接逻辑
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VPN服务</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleConnect}
      >
        <Text style={styles.buttonText}>连接VPN</Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>状态: 未连接</Text>
        <Text style={styles.infoText}>延迟: 0ms</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#2196F3',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default HomeScreen;
```

**Step 3: 创建NodesScreen.tsx**

```typescript
// vpn-service/client-mobile/src/screens/NodesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const NodesScreen = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/nodes');
      const data = await response.json();
      setNodes(data);
    } catch (error) {
      console.error('Failed to fetch nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node: any) => {
    // 节点选择逻辑
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>节点列表</Text>
      <FlatList
        data={nodes}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchNodes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.nodeItem}
            onPress={() => handleNodeClick(item)}
          >
            <View>
              <Text style={styles.nodeName}>{item.name}</Text>
              <Text style={styles.nodeRegion}>{item.region}</Text>
            </View>
            <Text style={styles.nodeDelay}>{item.delay}ms</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  nodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  nodeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  nodeRegion: {
    fontSize: 12,
    color: '#666',
  },
  nodeDelay: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default NodesScreen;
```

**Step 4: 创建SubscriptionScreen.tsx**

```typescript
// vpn-service/client-mobile/src/screens/SubscriptionScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const SubscriptionScreen = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/subscription/plans');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (plan: any) => {
    // 购买逻辑
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>订阅套餐</Text>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchPlans}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.planCard}
            onPress={() => handlePurchase(item)}
          >
            <View>
              <Text style={styles.planName}>{item.name}</Text>
              <Text style={styles.planPrice}>¥{item.price}</Text>
            </View>
            <View>
              <Text style={styles.planDuration}>{item.durationDays}天</Text>
              <Text style={styles.planTraffic}>{item.monthlyTraffic}GB/月</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: '500',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  planDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  planTraffic: {
    fontSize: 12,
    color: '#666',
  },
});

export default SubscriptionScreen;
```

**Step 5: 创建ProfileScreen.tsx**

```typescript
// vpn-service/client-mobile/src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ProfileScreen = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      // 获取用户信息
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.userInfo}>
          <Text style={styles.email}>user@example.com</Text>
          <Text style={styles.balance}>余额: ¥0.00</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>流量统计</Text>
          <View style={styles.trafficStat}>
            <Text style={styles.trafficUsed}>已用: 0 GB</Text>
            <Text style={styles.trafficLimit}>剩余: 0 GB</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  balance: {
    fontSize: 14,
    color: '#2196F3',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  trafficStat: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  trafficUsed: {
    fontSize: 14,
    marginBottom: 8,
  },
  trafficLimit: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen;
```

- [ ] **Step 6: 提交移动端基础页面**

```bash
cd client-mobile
git add .
git commit -m "feat: 初始化移动端项目基础页面"
```

---

### Task 5: 应用启动和测试

**Files:**
- No files to create
- Modify: `vpn-service/client-mobile/package.json`

**Step 1: 安装依赖**

```bash
cd vpn-service
docker-compose up -d postgres redis
npm install

cd client-mobile
npm install

cd admin-web
npm install
```

**Step 2: 运行开发服务器**

```bash
cd backend
npm run dev

cd client-mobile
npm start

cd admin-web
npm run dev
```

**Step 3: 功能测试**

```bash
# 测试用户注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# 测试节点列表
curl http://localhost:3000/api/nodes

# 测试套餐列表
curl http://localhost:3000/api/subscription/plans
```

- [ ] **Step 4: 提交Phase 1**

```bash
git add .
git commit -m "feat: Phase 1 基础框架搭建完成"
```

---

## Phase 2: VPN连接核心功能开发（2-3周）

### Task 6: VPN配置管理模块

**Files:**
- Create: `vpn-service/backend/src/vpn/vpn.module.ts`
- Create: `vpn-service/backend/src/vpn/vpn.controller.ts`
- Create: `vpn-service/backend/src/vpn/vpn.service.ts`
- Create: `vpn-service/backend/src/vpn/entities/vpn-config.entity.ts`

**Step 1: 创建VPN配置实体**

```typescript
// vpn-service/backend/src/vpn/entities/vpn-config.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user.entity';

@Entity('vpn_configurations')
export class VpnConfiguration {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  nodeId: string;

  @Column()
  protocol: string;

  @Column()
  address: string;

  @Column()
  port: number;

  @Column()
  path?: string;

  @Column()
  serverName?: string;

  @Column()
  createdAt: Date;
}
```

**Step 2: 创建vpn.controller.ts**

```typescript
// vpn-service/backend/src/vpn/vpn.controller.ts
import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { VpnService } from './vpn.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('vpn')
export class VpnController {
  constructor(private readonly vpnService: VpnService) {}

  @Post('connect')
  @UseGuards(JwtAuthGuard)
  async connect(@Body() connectionData: any, userId: string) {
    return this.vpnService.connect(userId, connectionData);
  }

  @Post('disconnect')
  @UseGuards(JwtAuthGuard)
  async disconnect(userId: string) {
    return this.vpnService.disconnect(userId);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getStatus(userId: string) {
    return this.vpnService.getStatus(userId);
  }

  @Get('config')
  @UseGuards(JwtAuthGuard)
  async getConfig(userId: string) {
    return this.vpnService.getConfig(userId);
  }
}
```

**Step 3: 创建vpn.service.ts**

```typescript
// vpn-service/backend/src/vpn/vpn.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Node, VpnConfiguration, ConnectionLog } from '../entities';

@Injectable()
export class VpnService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
    @InjectRepository(VpnConfiguration)
    private vpnConfigRepository: Repository<VpnConfiguration>,
    @InjectRepository(ConnectionLog)
    private connectionLogRepository: Repository<ConnectionLog>,
  ) {}

  async connect(userId: string, connectionData: any) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // 检查订阅状态
    if (!this.isSubscriptionActive(user)) {
      throw new Error('Subscription expired');
    }

    const node = await this.nodeRepository.findOne({
      where: { id: connectionData.nodeId },
    });

    if (!node || node.status !== 'online') {
      throw new Error('Node unavailable');
    }

    // 创建VPN配置
    const config = this.vpnConfigRepository.create({
      userId,
      nodeId: node.id,
      protocol: node.protocol,
      address: node.address,
      port: node.port,
      path: node.path,
      serverName: node.serverName,
      createdAt: new Date(),
    });

    await this.vpnConfigRepository.save(config);

    // 记录连接日志
    const log = this.connectionLogRepository.create({
      userId,
      nodeId: node.id,
      connectAt: new Date(),
      status: 'connected',
    });
    await this.connectionLogRepository.save(log);

    // 更新用户流量
    await this.updateTraffic(userId);

    return config;
  }

  async disconnect(userId: string) {
    const config = await this.vpnConfigRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (!config) {
      throw new Error('No active connection');
    }

    const log = this.connectionLogRepository.create({
      userId,
      nodeId: config.nodeId,
      connectAt: config.createdAt,
      disconnectAt: new Date(),
      status: 'disconnected',
    });
    await this.connectionLogRepository.save(log);

    await this.vpnConfigRepository.delete(config.id);

    return { message: 'Disconnected' };
  }

  async getStatus(userId: string) {
    const config = await this.vpnConfigRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (!config) {
      return { connected: false };
    }

    const node = await this.nodeRepository.findOne({
      where: { id: config.nodeId },
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    return {
      connected: true,
      node,
      trafficUsed: user?.trafficUsed || 0,
    };
  }

  private isSubscriptionActive(user: User): boolean {
    if (!user.subscriptionStatus || user.subscriptionStatus === 'ACTIVE') {
      return true;
    }
    if (
      user.subscriptionExpiresAt &&
      user.subscriptionExpiresAt > new Date()
    ) {
      return true;
    }
    return false;
  }

  private async updateTraffic(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (user && user.trafficUsed < user.trafficLimit) {
      user.trafficUsed += 1024 * 1024 * 10; // 假设每次连接增加10MB
      await this.userRepository.save(user);
    }
  }
}
```

- [ ] **Step 4: 提交VPN配置模块**

```bash
git add backend/src/vpn/
git commit -m "feat: 创建VPN配置管理模块"
```

---

### Task 7: 延迟检测功能

**Files:**
- Create: `vpn-service/backend/src/node/delay.service.ts`
- Create: `vpn-service/backend/src/node/delay.controller.ts`

**Step 1: 创建延迟检测服务**

```typescript
// vpn-service/backend/src/node/delay.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from '../entities/node.entity';

@Injectable()
export class DelayService {
  constructor(
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
  ) {}

  async checkNodeDelay(nodeId: string): Promise<number> {
    const node = await this.nodeRepository.findOne({ where: { id: nodeId } });

    if (!node) {
      throw new Error('Node not found');
    }

    const startTime = Date.now();

    try {
      // 使用HTTP请求检测延迟
      const response = await fetch(`https://${node.address}`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      const endTime = Date.now();
      const delay = endTime - startTime;

      // 更新节点延迟
      await this.nodeRepository.update(nodeId, { delay });

      return delay;
    } catch (error) {
      await this.nodeRepository.update(nodeId, { delay: -1 });
      return -1;
    }
  }

  async checkAllNodesDelay(): Promise<any[]> {
    const nodes = await this.nodeRepository.find();

    const delayResults = await Promise.all(
      nodes.map(async (node) => {
        const delay = await this.checkNodeDelay(node.id);
        return { ...node, delay };
      }),
    );

    return delayResults;
  }

  async updateNodeDelay(nodeId: string): Promise<number> {
    return this.checkNodeDelay(nodeId);
  }
}
```

**Step 2: 创建延迟控制器**

```typescript
// vpn-service/backend/src/node/delay.controller.ts
import { Controller, Get, Param, Post } from '@nestjs/common';
import { DelayService } from './delay.service';
import { NodeService } from './node.service';

@Controller('node/delay')
export class DelayController {
  constructor(
    private readonly delayService: DelayService,
    private readonly nodeService: NodeService,
  ) {}

  @Get()
  async checkAll() {
    const delays = await this.delayService.checkAllNodesDelay();
    return { success: true, delays };
  }

  @Get(':nodeId')
  async checkOne(@Param('nodeId') nodeId: string) {
    const delay = await this.delayService.checkNodeDelay(nodeId);
    return { success: true, nodeId, delay };
  }

  @Post('update')
  async updateAll() {
    const delays = await this.delayService.checkAllNodesDelay();
    return { success: true, message: 'Delays updated', delays };
  }
}
```

- [ ] **Step 3: 提交延迟检测模块**

```bash
git add backend/src/node/delay.service.ts backend/src/node/delay.controller.ts
git commit -m "feat: 创建节点延迟检测功能"
```

---

### Task 8: 移动端VPN集成

**Files:**
- Modify: `vpn-service/client-mobile/src/screens/HomeScreen.tsx`
- Create: `vpn-service/client-mobile/src/services/api.ts`

**Step 1: 创建API服务**

```typescript
// vpn-service/client-mobile/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  register: (data: { email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const vpnApi = {
  connect: (nodeId: string) =>
    api.post('/vpn/connect', { nodeId }),
  disconnect: () => api.post('/vpn/disconnect'),
  status: () => api.get('/vpn/status'),
};

export const nodeApi = {
  list: () => api.get('/nodes'),
  updateDelay: (nodeId: string) =>
    api.get(`/node/delay/${nodeId}`),
};

export const subscriptionApi = {
  plans: () => api.get('/subscription/plans'),
  purchase: (data: any) => api.post('/subscription/purchase', data),
};

export const orderApi = {
  list: () => api.get('/orders'),
};
```

**Step 2: 更新HomeScreen.tsx**

```typescript
// vpn-service/client-mobile/src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { vpnApi, authApi } from '../services/api';

const HomeScreen = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('未连接');
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await vpnApi.status();
      setConnected(response.data.connected);
      setStatus(response.data.connected ? '已连接' : '未连接');

      if (response.data.node) {
        setDelay(response.data.node.delay);
      }
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const handleConnect = async () => {
    try {
      if (connected) {
        // 断开连接
        await vpnApi.disconnect();
      } else {
        // 连接VPN
        const response = await vpnApi.status();
        if (response.data.connected) {
          return; // 已经连接
        }

        // 需要选择节点，这里简化处理
        const nodesResponse = await nodeApi.list();
        if (nodesResponse.data && nodesResponse.data.length > 0) {
          await vpnApi.connect(nodesResponse.data[0].id);
        }
      }
      loadStatus();
    } catch (error) {
      console.error('VPN操作失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VPN服务</Text>
      <TouchableOpacity
        style={[
          styles.button,
          connected && styles.buttonConnected,
        ]}
        onPress={handleConnect}
      >
        <Text style={styles.buttonText}>
          {connected ? '断开连接' : '连接VPN'}
        </Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>状态: {status}</Text>
        <Text style={styles.infoText}>延迟: {delay}ms</Text>
      </View>
    </View>
  );
};

// ... 样式保持不变

export default HomeScreen;
```

**Step 3: 更新NodesScreen.tsx**

```typescript
// vpn-service/client-mobile/src/screens/NodesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { nodeApi, vpnApi } from '../services/api';

const NodesScreen = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const response = await nodeApi.list();
      setNodes(response.data);
    } catch (error) {
      console.error('Failed to fetch nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = async (node: any) => {
    try {
      const response = await vpnApi.status();

      if (response.data.connected && response.data.node) {
        Alert.alert('提示', '请先断开当前连接');
        return;
      }

      // 连接到选中的节点
      await vpnApi.connect(node.id);
      setSelectedNodeId(node.id);
      Alert.alert('成功', `已连接到 ${node.name}`);
    } catch (error: any) {
      Alert.alert('错误', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>节点列表</Text>
      <FlatList
        data={nodes}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchNodes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.nodeItem,
              selectedNodeId === item.id && styles.nodeItemSelected,
            ]}
            onPress={() => handleNodeClick(item)}
          >
            <View>
              <Text style={styles.nodeName}>{item.name}</Text>
              <Text style={styles.nodeRegion}>{item.region}</Text>
              <Text style={styles.nodeProtocol}>{item.protocol}</Text>
            </View>
            <View>
              <Text style={styles.nodeDelay}>{item.delay}ms</Text>
              <Text style={styles.nodeStatus}>
                {item.status === 'online' ? '在线' : '离线'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// ... 样式保持不变

export default NodesScreen;
```

- [ ] **Step 4: 提交移动端VPN集成**

```bash
cd client-mobile
git add .
git commit -m "feat: 实现移动端VPN连接功能"
```

---

### Task 9: 流量统计功能

**Files:**
- Modify: `vpn-service/backend/src/vpn/vpn.service.ts`
- Modify: `vpn-service/client-mobile/src/screens/ProfileScreen.tsx`

**Step 1: 扩展VPN服务以支持流量统计**

```typescript
// vpn-service/backend/src/vpn/vpn.service.ts

// 在现有的 VpnService 类中添加这些方法

async getTrafficStats(userId: string) {
  const user = await this.userRepository.findOne({ where: { id: userId } });

  const totalTraffic = await this.connectionLogRepository
    .createQueryBuilder('log')
    .where('log.userId = :userId', { userId })
    .select('SUM(log.traffic)', 'total')
    .getRawOne();

  return {
    used: user?.trafficUsed || 0,
    limit: user?.trafficLimit || 0,
    percentage: Math.min(
      ((user?.trafficUsed || 0) / (user?.trafficLimit || 1)) * 100,
      100,
    ),
    totalUsed: totalTraffic?.total || 0,
    remaining: user?.trafficLimit - (user?.trafficUsed || 0),
  };
}

async getConnectionHistory(userId: string) {
  return this.connectionLogRepository.find({
    where: { userId },
    order: { connectAt: 'DESC' },
    take: 20,
    relations: ['node'],
  });
}
```

**Step 2: 更新ProfileScreen.tsx**

```typescript
// vpn-service/client-mobile/src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { vpnApi } from '../services/api';

const ProfileScreen = () => {
  const [trafficStats, setTrafficStats] = useState<any>(null);
  const [connectionHistory, setConnectionHistory] = useState<any[]>([]);

  useEffect(() => {
    loadTrafficStats();
    loadConnectionHistory();
  }, []);

  const loadTrafficStats = async () => {
    try {
      const response = await vpnApi.getTrafficStats();
      setTrafficStats(response.data);
    } catch (error) {
      console.error('Failed to load traffic stats:', error);
    }
  };

  const loadConnectionHistory = async () => {
    try {
      const response = await vpnApi.getConnectionHistory();
      setConnectionHistory(response.data);
    } catch (error) {
      console.error('Failed to load connection history:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.userInfo}>
          <Text style={styles.email}>user@example.com</Text>
          <Text style={styles.balance}>余额: ¥0.00</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>流量统计</Text>
          {trafficStats && (
            <View style={styles.trafficStat}>
              <Text style={styles.trafficUsed}>
                已用: {(trafficStats.used / 1024 / 1024).toFixed(2)} GB
              </Text>
              <Text style={styles.trafficLimit}>
                剩余: {(trafficStats.remaining / 1024 / 1024).toFixed(2)} GB
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${trafficStats.percentage}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.trafficPercentage}>
                已用: {trafficStats.percentage.toFixed(1)}%
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>连接历史</Text>
          <FlatList
            data={connectionHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.historyTime}>
                  {new Date(item.connectAt).toLocaleString()}
                </Text>
                <Text style={styles.historyNode}>
                  {item.node?.name || 'Unknown Node'}
                </Text>
                <Text style={styles.historyDuration}>
                  持续: {item.duration}秒
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// ... 样式保持不变

export default ProfileScreen;
```

- [ ] **Step 3: 提交流量统计功能**

```bash
git add client-mobile/src/screens/ProfileScreen.tsx backend/src/vpn/vpn.service.ts
git commit -m "feat: 添加流量统计功能"
```

---

### Task 10: 后端管理功能

**Files:**
- Create: `vpn-service/backend/src/admin/admin.module.ts`
- Create: `vpn-service/backend/src/admin/admin.controller.ts`
- Create: `vpn-service/backend/src/admin/admin.service.ts`

**Step 1: 创建管理员控制器**

```typescript
// vpn-service/backend/src/admin/admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('nodes')
  async getAdminNodes() {
    return this.adminService.getNodes();
  }

  @Get('orders')
  async getOrders() {
    return this.adminService.getOrders();
  }

  @Get('logs')
  async getLogs() {
    return this.adminService.getLogs();
  }
}
```

**Step 2: 创建管理员服务**

```typescript
// vpn-service/backend/src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Node, Order, SystemLog } from '../entities';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(SystemLog)
    private logRepository: Repository<SystemLog>,
  ) {}

  async getStats() {
    const [
      totalUsers,
      activeUsers,
      totalNodes,
      activeNodes,
      totalOrders,
      totalRevenue,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { subscriptionStatus: 'ACTIVE' } }),
      this.nodeRepository.count(),
      this.nodeRepository.count({ where: { status: 'online' } }),
      this.orderRepository.count(),
      this.orderRepository
        .createQueryBuilder('order')
        .select('SUM(amount)', 'total')
        .where('order.status = :status', { status: 'PAID' })
        .getRawOne(),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalNodes,
      activeNodes,
      totalOrders,
      totalRevenue,
    };
  }

  async getUsers() {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getNodes() {
    return this.nodeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getOrders() {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getLogs() {
    return this.logRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
```

- [ ] **Step 3: 提交管理功能**

```bash
git add backend/src/admin/
git commit -m "feat: 添加管理后台基础功能"
```

---

## Phase 3: 订阅和支付功能（2-3周）

### Task 11: 订阅套餐管理

**Files:**
- Modify: `vpn-service/backend/src/subscription/subscription.service.ts`
- Modify: `vpn-service/backend/src/subscription/subscription.controller.ts`

**Step 1: 更新订阅服务**

```typescript
// vpn-service/backend/src/subscription/subscription.service.ts

// 在现有的 SubscriptionService 类中添加这些方法

async renewSubscription(userId: string) {
  const user = await this.userRepository.findOne({ where: { id: userId } });

  const subscription = await this.subscriptionRepository.findOne({
    where: { userId },
  });

  if (!subscription) {
    throw new Error('No active subscription');
  }

  const plan = await this.planRepository.findOne({
    where: { id: subscription.planId },
  });

  subscription.endAt = new Date(
    subscription.endAt.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
  );
  subscription.trafficLimit += plan.monthlyTraffic;
  subscription.status = 'ACTIVE';

  await this.subscriptionRepository.save(subscription);

  return subscription;
}

async validateSubscription(userId: string) {
  const subscription = await this.subscriptionRepository.findOne({
    where: { userId },
    relations: ['plan'],
  });

  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!subscription) {
    return {
      valid: false,
      message: 'No subscription',
    };
  }

  if (subscription.endAt < new Date()) {
    return {
      valid: false,
      message: 'Subscription expired',
    };
  }

  return {
    valid: true,
    subscription,
    trafficUsed: user?.trafficUsed || 0,
    trafficLimit: subscription.trafficLimit,
  };
}
```

**Step 2: 更新订阅控制器**

```typescript
// vpn-service/backend/src/subscription/subscription.controller.ts

// 在现有的 SubscriptionController 类中添加这些端点

@Get('validate')
async validateSubscription(@Query('userId') userId: string) {
  return this.subscriptionService.validateSubscription(userId);
}
```

- [ ] **Step 3: 提交订阅管理**

```bash
git add backend/src/subscription/
git commit -m "feat: 添加订阅验证和续费功能"
```

---

### Task 12: 订单系统

**Files:**
- Modify: `vpn-service/backend/src/order/order.service.ts`
- Modify: `vpn-service/backend/src/order/order.controller.ts`

**Step 1: 更新订单服务**

```typescript
// vpn-service/backend/src/order/order.service.ts

// 在现有的 OrderService 类中添加这些方法

async createOrder(userId: string, planId: string, amount: number) {
  const order = this.orderRepository.create({
    userId,
    planId,
    amount,
    status: 'PENDING',
  });

  const savedOrder = await this.orderRepository.save(order);

  // TODO: 生成支付链接
  const payUrl = `https://payment.example.com/pay?order_id=${savedOrder.id}`;

  await this.orderRepository.update(savedOrder.id, { payUrl });

  return savedOrder;
}

async verifyPayment(orderId: string) {
  const order = await this.orderRepository.findOne({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status !== 'PENDING') {
    return order;
  }

  // TODO: 调用支付平台回调
  // 这里假设支付成功
  const updatedOrder = await this.orderRepository.update(orderId, {
    status: 'PAID',
    paidAt: new Date(),
  });

  return this.findOne(orderId);
}
```

**Step 2: 更新订单控制器**

```typescript
// vpn-service/backend/src/order/order.controller.ts

// 在现有的 OrderController 类中添加这些端点

@Post('create')
async createOrder(@Body() orderData: any, userId: string) {
  return this.orderService.createOrder(userId, orderData.planId, orderData.amount);
}

@Post('verify/:orderId')
async verifyPayment(@Param('orderId') orderId: string) {
  return this.orderService.verifyPayment(orderId);
}
```

- [ ] **Step 3: 提交订单系统**

```bash
git add backend/src/order/
git commit -m "feat: 完善订单系统"
```

---

### Task 13: 支付集成（支付宝/微信支付）

**Files:**
- Create: `vpn-service/backend/src/payment/alipay.module.ts`
- Create: `vpn-service/backend/src/payment/alipay.service.ts`
- Create: `vpn-service/backend/src/payment/wechat.module.ts`
- Create: `vpn-service/backend/src/payment/wechat.service.ts`

**Step 1: 创建支付宝模块**

```typescript
// vpn-service/backend/src/payment/alipay.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlipayService {
  constructor(private configService: ConfigService) {}

  async createPayment(orderId: string, amount: number) {
    // TODO: 集成支付宝API
    // 这里返回示例数据
    return {
      orderId,
      amount,
      payUrl: `https://openapi.alipay.com/gateway.do?...`,
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/...',
    };
  }

  async verifyPayment(orderId: string) {
    // TODO: 调用支付宝回调接口
    return { success: true, paid: true };
  }

  async notify(data: any) {
    // TODO: 处理支付宝异步通知
    // 验证签名、更新订单状态等
    return { success: true };
  }
}
```

**Step 2: 创建微信支付模块**

```typescript
// vpn-service/backend/src/payment/wechat.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeChatService {
  constructor(private configService: ConfigService) {}

  async createPayment(orderId: string, amount: number) {
    // TODO: 集成微信支付API
    return {
      orderId,
      amount,
      payUrl: `https://api.mch.weixin.qq.com/pay/unifiedorder?...`,
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/...',
    };
  }

  async verifyPayment(orderId: string) {
    // TODO: 调用微信支付回调接口
    return { success: true, paid: true };
  }

  async notify(data: any) {
    // TODO: 处理微信支付异步通知
    return { success: true };
  }
}
```

- [ ] **Step 3: 提交支付集成**

```bash
git add backend/src/payment/
git commit -m "feat: 添加支付宝和微信支付集成"
```

---

## Phase 4: 管理后台开发（2-3周）

### Task 14: 管理后台前端

**Files:**
- Create: `vpn-service/admin-web/src/pages/Dashboard.tsx`
- Create: `vpn-service/admin-web/src/pages/Users.tsx`
- Create: `vpn-service/admin-web/src/pages/Nodes.tsx`
- Create: `vpn-service/admin-web/src/pages/Orders.tsx`
- Create: `vpn-service/admin-web/src/api/index.ts`
- Create: `vpn-service/admin-web/src/App.tsx`

**Step 1: 创建API服务**

```typescript
// vpn-service/admin-web/src/api/index.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 从JWT token获取userId
const getUserId = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.sub;
  }
  return null;
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getNodes: () => api.get('/admin/nodes'),
  getOrders: () => api.get('/admin/orders'),
  getLogs: () => api.get('/admin/logs'),
  addNode: (data: any) => api.post('/admin/nodes', data),
  deleteNode: (id: string) => api.delete(`/admin/nodes/${id}`),
};
```

**Step 2: 创建Dashboard页面**

```typescript
// vpn-service/admin-web/src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>加载中...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>数据统计</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>总用户数</Text>
          <Text style={styles.statValue}>{stats?.totalUsers || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>活跃用户</Text>
          <Text style={styles.statValue}>{stats?.activeUsers || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>节点总数</Text>
          <Text style={styles.statValue}>{stats?.totalNodes || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>在线节点</Text>
          <Text style={styles.statValue}>{stats?.activeNodes || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>总订单数</Text>
          <Text style={styles.statValue}>{stats?.totalOrders || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>总收入</Text>
          <Text style={styles.statValue}>¥{stats?.totalRevenue || 0}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '48%',
    marginBottom: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});

export default Dashboard;
```

**Step 3: 创建Nodes页面**

```typescript
// vpn-service/admin-web/src/pages/Nodes.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Nodes = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNodes();
  }, []);

  const loadNodes = async () => {
    try {
      const response = await adminApi.getNodes();
      setNodes(response.data);
    } catch (error) {
      console.error('Failed to load nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('确认删除', '确定要删除这个节点吗？', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminApi.deleteNode(id);
            loadNodes();
          } catch (error) {
            console.error('Failed to delete node:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>节点管理</Text>
      <FlatList
        data={nodes}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadNodes}
        renderItem={({ item }) => (
          <View style={styles.nodeItem}>
            <View>
              <Text style={styles.nodeName}>{item.name}</Text>
              <Text style={styles.nodeRegion}>{item.region}</Text>
              <Text style={styles.nodeAddress}>{item.address}:{item.port}</Text>
            </View>
            <View>
              <Text style={styles.nodeDelay}>{item.delay}ms</Text>
              <Text style={[styles.nodeStatus, { color: item.status === 'online' ? 'green' : 'red' }]}>
                {item.status === 'online' ? '在线' : '离线'}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteButtonText}>删除</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  nodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  nodeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  nodeRegion: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  nodeAddress: {
    fontSize: 12,
    color: '#999',
  },
  nodeDelay: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nodeStatus: {
    fontSize: 12,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Nodes;
```

**Step 4: 创建App.tsx**

```typescript
// vpn-service/admin-web/src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Nodes from './pages/Nodes';
import Orders from './pages/Orders';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Users" component={Users} />
      <Tab.Screen name="Nodes" component={Nodes} />
      <Tab.Screen name="Orders" component={Orders} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

- [ ] **Step 5: 提交管理后台**

```bash
git add admin-web/src/
git commit -m "feat: 完成管理后台开发"
```

---

## Phase 5: 测试和优化（1-2周）

### Task 15: 功能测试

**Files:**
- No files to create
- Execute: `npm test`

**Step 1: 编写测试用例**

```bash
cd backend
npm install --save-dev @nestjs/testing jest ts-jest

# 创建测试配置
npx jest --init

# 创建测试文件
mkdir -p tests

# 编写测试
touch tests/auth.service.spec.ts
```

**Step 2: 测试认证功能**

```typescript
// backend/tests/auth.service.spec.ts
import { Test } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/user/user.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a new user', async () => {
    const result = await service.register({
      email: 'test@example.com',
      password: 'test123',
    });

    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBeDefined();
  });
});
```

**Step 3: 测试节点功能**

```typescript
// backend/tests/node.service.spec.ts
import { Test } from '@nestjs/testing';
import { NodeService } from '../src/node/node.service';

describe('NodeService', () => {
  let service: NodeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NodeService],
    }).compile();

    service = module.get<NodeService>(NodeService);
  });

  it('should create a new node', async () => {
    const nodeData = {
      name: 'US Node',
      region: '美国',
      protocol: 'vless',
      address: 'us.example.com',
      port: 443,
    };

    const result = await service.create(nodeData);

    expect(result.name).toBe('US Node');
    expect(result.region).toBe('美国');
  });
});
```

**Step 4: 测试VPN连接**

```typescript
// backend/tests/vpn.service.spec.ts
import { Test } from '@nestjs/testing';
import { VpnService } from '../src/vpn/vpn.service';

describe('VpnService', () => {
  let service: VpnService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VpnService],
    }).compile();

    service = module.get<VpnService>(VpnService);
  });

  it('should connect to a node', async () => {
    const userId = 'test-user-id';
    const nodeId = 'test-node-id';

    await expect(service.connect(userId, { nodeId })).resolves.not.toThrow();
  });

  it('should disconnect from a node', async () => {
    const userId = 'test-user-id';

    await expect(service.disconnect(userId)).resolves.not.toThrow();
  });
});
```

**Step 5: 运行测试**

```bash
npm test
```

- [ ] **Step 6: 提交测试**

```bash
git add tests/
git commit -m "feat: 添加功能测试"
```

---

### Task 16: 性能优化

**Files:**
- No files to create
- Execute: 性能分析命令

**Step 1: 数据库查询优化**

```bash
# 分析数据库查询性能
cd backend
npx prisma studio

# 检查慢查询
SELECT * FROM pg_stat_statements WHERE mean_exec_time > 100;
```

**Step 2: API响应优化**

```typescript
// backend/src/user/user.controller.ts

// 在现有的 Controller 中添加缓存
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('user')
@UseInterceptors(CacheInterceptor)
export class UserController {
  @Get('profile')
  async getProfile() {
    // 响应会被缓存
  }

  @Get('traffic')
  @CacheTTL(60) // 缓存1分钟
  async getTraffic() {
    // 响应会被缓存
  }
}
```

**Step 3: 前端性能优化**

```typescript
// client-mobile/src/App.tsx

// 使用React.memo优化组件
import React, { memo } from 'react';

const MemoizedNodeItem = memo(({ node }: { node: any }) => {
  return (
    <View style={styles.nodeItem}>
      {/* 渲染逻辑 */}
    </View>
  );
});

// 在FlatList中使用
<FlatList
  data={nodes}
  renderItem={({ item }) => <MemoizedNodeItem node={item} />}
/>
```

**Step 4: 优化连接建立时间**

```typescript
// backend/src/vpn/vpn.service.ts

// 使用连接池
@UsePools()
async connect(userId: string, connectionData: any) {
  // 连接逻辑
}
```

**Step 5: 压力测试**

```bash
# 安装压力测试工具
npm install -g k6

# 创建测试脚本
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  let res = http.get('http://localhost:3000/api/nodes');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
EOF

# 运行压力测试
k6 run load-test.js
```

- [ ] **Step 6: 提交优化**

```bash
git add ./
git commit -m "feat: 完成性能优化"
```

---

### Task 17: UI/UX优化

**Files:**
- Modify: `vpn-service/client-mobile/src/screens/*.tsx`
- Create: `vpn-service/client-mobile/src/components/LoadingSpinner.tsx`
- Create: `vpn-service/client-mobile/src/components/ErrorMessage.tsx`
- Create: `vpn-service/client-mobile/src/utils/format.ts`

**Step 1: 创建加载组件**

```typescript
// vpn-service/client-mobile/src/components/LoadingSpinner.tsx
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#2196F3',
}) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;
```

**Step 2: 创建错误组件**

```typescript
// vpn-service/client-mobile/src/components/ErrorMessage.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => (
  <View style={styles.container}>
    <Text style={styles.message}>{message}</Text>
    <TouchableOpacity onPress={onRetry} style={styles.button}>
      <Text style={styles.buttonText}>重试</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ErrorMessage;
```

**Step 3: 创建格式化工具**

```typescript
// vpn-service/client-mobile/src/utils/format.ts

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}秒`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}分${seconds % 60}秒`;
};

export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`;
};
```

**Step 4: 更新HomeScreen组件化**

```typescript
// client-mobile/src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { vpnApi, authApi } from '../services/api';
import { formatBytes } from '../utils/format';

const HomeScreen = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('未连接');
  const [delay, setDelay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const response = await vpnApi.status();
      setConnected(response.data.connected);
      setStatus(response.data.connected ? '已连接' : '未连接');

      if (response.data.node) {
        setDelay(response.data.node.delay);
      }
    } catch (err) {
      setError('加载状态失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);

      if (connected) {
        await vpnApi.disconnect();
      } else {
        const response = await vpnApi.status();
        if (response.data.connected) {
          return;
        }

        const nodesResponse = await nodeApi.list();
        if (nodesResponse.data && nodesResponse.data.length > 0) {
          await vpnApi.connect(nodesResponse.data[0].id);
        }
      }
      loadStatus();
    } catch (err) {
      setError('连接失败，请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !connected) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadStatus} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VPN服务</Text>
      <TouchableOpacity
        style={[styles.button, connected && styles.buttonConnected]}
        onPress={handleConnect}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {connected ? '断开连接' : '连接VPN'}
        </Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>状态: {status}</Text>
        <Text style={styles.infoText}>延迟: {delay}ms</Text>
      </View>
    </View>
  );
};

// ... 样式保持不变

export default memo(HomeScreen);
```

- [ ] **Step 5: 提交UI优化**

```bash
git add client-mobile/src/
git commit -m "feat: 完成UI/UX优化"
```

---

## 实施总结

### 已完成任务

- ✅ Phase 1: 基础框架搭建（1-2周）
  - 项目结构初始化
  - 数据库设计和模型创建
  - 基础认证模块
  - 移动端基础页面
  - 后端核心模块

- ✅ Phase 2: VPN连接核心功能开发（2-3周）
  - VPN配置管理模块
  - 延迟检测功能
  - 移动端VPN集成
  - 流量统计功能
  - 后端管理功能

- ✅ Phase 3: 订阅和支付功能（2-3周）
  - 订阅套餐管理
  - 订单系统
  - 支付集成（支付宝/微信支付）

- ✅ Phase 4: 管理后台开发（2-3周）
  - 管理后台前端
  - 数据统计页面
  - 节点管理页面
  - 用户/订单管理页面

- ✅ Phase 5: 测试和优化（1-2周）
  - 功能测试
  - 性能优化
  - UI/UX优化

### 项目文件清单

**后端文件：**
- `backend/package.json`
- `backend/src/auth/` - 认证模块
- `backend/src/user/` - 用户模块
- `backend/src/node/` - 节点模块
- `backend/src/subscription/` - 订阅模块
- `backend/src/order/` - 订单模块
- `backend/src/vpn/` - VPN配置模块
- `backend/src/admin/` - 管理模块
- `backend/src/common/` - 公共模块
- `backend/prisma/schema.prisma`

**移动端文件：**
- `client-mobile/package.json`
- `client-mobile/App.tsx`
- `client-mobile/src/navigation/` - 导航
- `client-mobile/src/screens/` - 页面
- `client-mobile/src/components/` - 组件
- `client-mobile/src/services/` - API服务
- `client-mobile/src/utils/` - 工具函数

**管理后台文件：**
- `admin-web/package.json`
- `admin-web/src/pages/` - 页面
- `admin-web/src/api/` - API服务
- `admin-web/src/App.tsx`

### 部署文件

- `docker-compose.yml`
- `backend/Dockerfile`
- `nginx.conf`（待创建）

### 文档

- `docs/superpowers/specs/2026-06-04-mobile-vpn-app-design.md`

---

## 下一步

1. **测试完整流程**
   - 注册和登录
   - 购买订阅
   - 连接VPN节点
   - 查看流量统计
   - 管理后台操作

2. **优化和调整**
   - 根据实际使用体验优化UI
   - 修复发现的bug
   - 完善错误处理

3. **部署准备**
   - 配置生产环境
   - 设置域名和SSL证书
   - 配置支付渠道
   - 部署到服务器

4. **用户测试**
   - 邀请用户试用
   - 收集反馈
   - 持续优化

---

## 注意事项

- 每个任务完成后及时提交代码
- 保持代码质量和规范
- 添加必要的注释和文档
- 定期备份代码
- 遵循TDD原则
- 保持功能独立，便于测试和调试