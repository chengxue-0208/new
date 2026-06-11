# 本地数据库管理模块化开发计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 admin-react-app 项目中实现连接本地PostgreSQL数据库的完整CRUD功能，支持所有8张数据表的管理操作

**Architecture:** 模块化开发策略，将功能分解为4个独立模块：
1. 用户管理模块 - users表
2. 节点管理模块 - nodes表
3. 订阅和订单管理模块 - subscription_plans, orders, user_subscriptions表
4. 连接和系统管理模块 - vpn_configurations, connection_logs, system_logs表

每个模块完成后进行完整测试和代码提交，确保功能稳定可追溯

**Tech Stack:**
- 后端: NestJS + TypeORM + PostgreSQL
- 前端: React + TypeScript + Ant Design + TanStack Query
- 开发模式: TDD + 模块化 + 小步迭代 + 每模块完整测试

---

## 模块1: 用户管理模块

### Task 1.1: 后端用户Controller完善

**Files:**
- Create: `backend/src/user/user.controller.ts`
- Modify: `backend/src/user/user.service.ts:19-51`

- [ ] **Step 1: 完善用户Controller的CRUD端点**

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('search')
  async search(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<User>) {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

- [ ] **Step 2: 修改UsersService以支持新方法**

在 `backend/src/user/user.service.ts` 中添加以下方法：

```typescript
import { Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['subscriptionPlan', 'orders', 'connections', 'subscriptions'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['subscriptionPlan', 'orders', 'connections', 'subscriptions'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getSubscriptionStatus(id: string): Promise<any> {
    const user = await this.findOne(id);
    return {
      userId: user.id,
      email: user.email,
      status: user.subscriptionStatus,
      expiresAt: user.subscriptionExpiresAt,
      balance: user.balance,
      trafficUsed: user.trafficUsed,
      trafficLimit: user.trafficLimit
    };
  }
}
```

- [ ] **Step 3: 创建单元测试文件**

```typescript
// tests/user.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../src/user/user.controller';
import { UsersService } from '../src/user/user.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
```

- [ ] **Step 4: 运行测试验证**

```bash
cd /home/cheng/Project/vpn-service/backend
npm test tests/user.controller.spec.ts -v
# 预期: PASS
```

- [ ] **Step 5: 启动后端服务验证API**

```bash
cd /home/cheng/Project/vpn-service/backend
npm run start:dev
# 验证: http://localhost:3000/users 端点可用
```

- [ ] **Step 6: 提交代码**

```bash
cd /home/cheng/Project/vpn-service/backend
git add src/user/user.controller.ts src/user/user.service.ts tests/user.controller.spec.ts
git commit -m "feat: 完善用户管理CRUD API接口"
```

### Task 1.2: 前端用户管理页面完善

**Files:**
- Modify: `admin-react-app/src/pages/Users.tsx`
- Create: `admin-react-app/src/services/user.ts`

- [ ] **Step 1: 创建用户API服务**

```typescript
// admin-react-app/src/services/user.ts
import api from './api';

export const userService = {
  getUsers: (params?: any) => api.get('/users', { params }),
  getUserById: (id: string) => api.get(`/users/${id}`),
  createUser: (data: any) => api.post('/users', data),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  searchUser: (email: string) => api.get(`/users/search?email=${email}`),
};
```

- [ ] **Step 2: 更新Users.tsx页面**

修改 `admin-react-app/src/pages/Users.tsx`，添加编辑和删除功能：

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Button, Space, Tag, Input, Modal, Form, message } from 'antd';
import { useState } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user';

export default function Users() {
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', pagination.current, pagination.pageSize, searchText],
    queryFn: () => api.get(`/users?page=${pagination.current}&limit=${pagination.pageSize}&search=${searchText}`).then((res: any) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (values: any) => api.post('/users', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      form.resetFields();
      message.success('用户创建成功');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: any) => api.put(`/users/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      message.success('用户更新成功');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('用户删除成功');
    },
  });

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'subscriptionStatus',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : status === 'EXPIRED' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => `¥${balance.toFixed(2)}`,
    },
    {
      title: '已用流量',
      dataIndex: 'trafficUsed',
      key: 'trafficUsed',
      render: (trafficUsed: number, record: any) => `${trafficUsed} / ${record.trafficLimit}`,
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              setIsModalOpen(true);
              form.setFieldsValue(record);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除用户 "${record.email}" 吗？`,
                onOk: () => deleteMutation.mutate(record.id),
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#ffffff', margin: '0 0 16px 0' }}>
        用户管理
      </h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          className="cyber-input"
          placeholder="搜索用户邮箱"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" className="cyber-btn-primary">
          添加用户
        </Button>
        <Button type="default" onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}>
          刷新
        </Button>
      </Space>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
        />
      </div>

      <Modal
        title={editingId ? '编辑用户' : '添加用户'}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        className="cyber-modal"
        confirmLoading={updateMutation.isPending || createMutation.isPending}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          {!editingId && (
            <>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '邮箱格式不正确' }
                ]}
              >
                <Input className="cyber-input" placeholder="请输入邮箱" />
              </Form.Item>
              <Form.Item
                name="passwordHash"
                label="密码哈希"
                rules={[{ required: true, message: '请输入密码哈希' }]}
              >
                <Input.Password className="cyber-input" placeholder="请输入密码哈希" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="balance"
            label="余额"
            rules={[{ required: true, message: '请输入余额' }]}
          >
            <Input className="cyber-input" placeholder="请输入余额" type="number" />
          </Form.Item>
          <Form.Item
            name="subscriptionStatus"
            label="订阅状态"
            rules={[{ required: true, message: '请选择订阅状态' }]}
          >
            <Input className="cyber-input" placeholder="ACTIVE/EXPIRED/CANCELLED" />
          </Form.Item>
          <Form.Item
            name="trafficUsed"
            label="已用流量"
            rules={[{ required: true, message: '请输入已用流量' }]}
          >
            <Input className="cyber-input" placeholder="请输入已用流量" type="number" />
          </Form.Item>
          <Form.Item
            name="trafficLimit"
            label="流量限额"
            rules={[{ required: true, message: '请输入流量限额' }]}
          >
            <Input className="cyber-input" placeholder="请输入流量限额" type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 3: 运行前端服务验证页面**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
npm run dev
# 验证: http://localhost:5173/users 页面正常显示
```

- [ ] **Step 4: 提交代码**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
git add src/pages/Users.tsx src/services/user.ts
git commit -m "feat: 完善用户管理前端页面，支持增删改查操作"
```

---

## 模块2: 节点管理模块

### Task 2.1: 后端节点Controller完善

**Files:**
- Modify: `backend/src/node/node.controller.ts`
- Modify: `backend/src/node/node.service.ts`

- [ ] **Step 1: 完善节点Controller**

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { NodeService } from './node.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('nodes')
@UseGuards(JwtAuthGuard)
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get()
  async findAll() {
    return this.nodeService.findAll();
  }

  @Get('search')
  async search(@Query('region') region: string) {
    return this.nodeService.findByRegion(region);
  }

  @Get('stats')
  async getStats() {
    return this.nodeService.getStats();
  }

  @Get('delay/stats')
  async getDelayStats() {
    return this.nodeService.getDelayStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.nodeService.findOne(id);
  }

  @Post()
  async create(@Body() nodeData: any) {
    return this.nodeService.create(nodeData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() nodeData: any) {
    return this.nodeService.update(id, nodeData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.nodeService.remove(id);
  }
}
```

- [ ] **Step 2: 完善节点Service**

```typescript
// backend/src/node/node.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from './node.entity';
import { VpnConfiguration } from '../entities/vpn-config.entity';

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
    @InjectRepository(VpnConfiguration)
    private configRepository: Repository<VpnConfiguration>,
  ) {}

  async create(nodeData: Partial<Node>): Promise<Node> {
    const node = this.nodeRepository.create(nodeData);
    return this.nodeRepository.save(node);
  }

  async findAll(): Promise<Node[]> {
    return this.nodeRepository.find({
      relations: ['configurations'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Node> {
    const node = await this.nodeRepository.findOne({
      where: { id },
      relations: ['configurations'],
    });
    if (!node) {
      throw new NotFoundException('Node not found');
    }
    return node;
  }

  async findByRegion(region: string): Promise<Node[]> {
    return this.nodeRepository.find({
      where: { region },
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: string, nodeData: Partial<Node>): Promise<Node> {
    await this.nodeRepository.update(id, nodeData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.nodeRepository.delete(id);
  }

  async getStats() {
    const nodes = await this.nodeRepository.find();
    return {
      total: nodes.length,
      online: nodes.filter(n => n.status === 'online').length,
      offline: nodes.filter(n => n.status === 'offline').length,
      free: nodes.filter(n => n.isFree).length,
      paid: nodes.filter(n => !n.isFree).length,
    };
  }

  async getDelayStats() {
    const nodes = await this.nodeRepository.find();
    const delays = nodes.map(n => n.delay);
    const avgDelay = delays.length > 0
      ? delays.reduce((a, b) => a + b, 0) / delays.length
      : 0;
    const maxDelay = delays.length > 0 ? Math.max(...delays) : 0;
    return {
      nodes: nodes.length,
      avgDelay: Math.round(avgDelay),
      maxDelay,
      minDelay: delays.length > 0 ? Math.min(...delays) : 0,
    };
  }
}
```

- [ ] **Step 3: 添加TypeORM配置到Node实体**

确保 `backend/src/entities/node.entity.ts` 中的导入和关系正确：

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { VpnConfiguration } from './vpn-config.entity';

@Entity('nodes')
@Index(['status'])
@Index(['region'])
@Index(['delay'])
export class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column()
  name: string = "";

  @Column()
  region: string = "";

  @Column()
  protocol: string = "";

  @Column()
  address: string = "";

  @Column()
  port: number = 0;

  @Column({ nullable: true })
  path: string = "";

  @Column({ nullable: true })
  serverName: string = "";

  @Column({ default: 0 })
  delay: number = 0;

  @Column({
    type: 'enum',
    enum: ['online', 'offline'],
    default: 'online'
  })
  status: string = "";

  @Column({ default: false })
  isFree: boolean = false;

  @ManyToOne(() => User, user => user.nodes)
  user: User | null = null;

  @OneToMany(() => VpnConfiguration, config => config.node)
  configurations: VpnConfiguration[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();
}
```

- [ ] **Step 4: 运行测试验证**

```bash
cd /home/cheng/Project/vpn-service/backend
npm test tests/node.controller.spec.ts -v
# 预期: PASS
```

- [ ] **Step 5: 启动后端验证API**

```bash
cd /home/cheng/Project/vpn-service/backend
npm run start:dev
# 验证: http://localhost:3000/nodes 端点可用
```

- [ ] **Step 6: 提交代码**

```bash
cd /home/cheng/Project/vpn-service/backend
git add src/node/node.controller.ts src/node/node.service.ts src/entities/node.entity.ts
git commit -m "feat: 完善节点管理CRUD API接口"
```

### Task 2.2: 前端节点管理页面完善

**Files:**
- Modify: `admin-react-app/src/pages/Nodes.tsx`

- [ ] **Step 1: 更新Nodes.tsx页面，添加编辑和删除功能**

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Button, Space, Tag, Input, Modal, Form, Select, InputNumber } from 'antd';
import { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const { TextArea } = Input;

interface NodeData {
  id: string;
  name: string;
  region: string;
  protocol: string;
  address: string;
  port: number;
  delay: number;
  status: string;
  isFree: boolean;
  serverName?: string;
  path?: string;
  createdAt: string;
}

export default function Nodes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['nodes'],
    queryFn: () => api.get('/nodes').then((res: any) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (values: any) => api.post('/nodes', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      setIsModalOpen(false);
      form.resetFields();
      window.location.reload();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: any) => api.put(`/nodes/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      window.location.reload();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/nodes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      window.location.reload();
    },
  });

  const columns = [
    {
      title: '节点ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: '节点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
      render: (region: string) => <Tag color="cyan">{region}</Tag>,
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (protocol: string) => <Tag color="purple">{protocol.toUpperCase()}</Tag>,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '延迟',
      dataIndex: 'delay',
      key: 'delay',
      render: (delay: number) => <Tag color={delay < 100 ? 'green' : delay < 200 ? 'orange' : 'red'}>{delay}ms</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'online' ? 'green' : status === 'offline' ? 'red' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'isFree',
      key: 'isFree',
      render: (isFree: boolean) => <Tag color={isFree ? 'blue' : 'red'}>{isFree ? '免费' : '付费'}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              setIsModalOpen(true);
              form.setFieldsValue(record);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除节点 "${record.name}" 吗？`,
                onOk: () => deleteMutation.mutate(record.id),
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: '#ffffff', margin: '0 0 8px 0' }}>
          节点管理
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="cyber-btn-primary"
        >
          添加节点
        </Button>
      </div>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
        />
      </div>

      <Modal
        title={editingId ? '编辑节点' : '添加节点'}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        className="cyber-modal"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="节点名称"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input className="cyber-input" placeholder="请输入节点名称" />
          </Form.Item>

          <Form.Item
            name="region"
            label="地区"
            rules={[{ required: true, message: '请选择地区' }]}
          >
            <Input className="cyber-input" placeholder="例如：香港、美国、日本" />
          </Form.Item>

          <Form.Item
            name="protocol"
            label="协议类型"
            rules={[{ required: true, message: '请选择协议类型' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择协议类型"
            >
              <Select.Option value="vmess">VMess</Select.Option>
              <Select.Option value="vless">VLESS</Select.Option>
              <Select.Option value="trojan">Trojan</Select.Option>
              <Select.Option value="ss">Shadowsocks</Select.Option>
              <Select.Option value="ssr">ShadowsocksR</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="节点地址"
            rules={[{ required: true, message: '请输入节点地址' }]}
          >
            <Input className="cyber-input" placeholder="请输入节点地址" />
          </Form.Item>

          <Form.Item
            name="port"
            label="端口"
            rules={[{ required: true, message: '请输入端口' }]}
          >
            <InputNumber className="cyber-input" placeholder="请输入端口" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="serverName"
            label="服务器名称"
            rules={[{ required: false, message: '请输入服务器名称' }]}
          >
            <Input className="cyber-input" placeholder="请输入服务器名称" />
          </Form.Item>

          <Form.Item
            name="path"
            label="路径"
            rules={[{ required: false, message: '请输入路径' }]}
          >
            <Input className="cyber-input" placeholder="请输入路径（如 /path）" />
          </Form.Item>

          <Form.Item
            name="delay"
            label="延迟（毫秒）"
            rules={[{ required: false, message: '请输入延迟' }]}
          >
            <InputNumber className="cyber-input" placeholder="请输入延迟" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="isFree"
            label="类型"
            rules={[{ required: false, message: '请选择类型' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择类型"
            >
              <Select.Option value={false}>付费节点</Select.Option>
              <Select.Option value={true}>免费节点</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: false, message: '请选择状态' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择状态"
            >
              <Select.Option value="online">在线</Select.Option>
              <Select.Option value="offline">离线</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 2: 运行前端服务验证页面**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
npm run dev
# 验证: http://localhost:5173/nodes 页面正常显示，可以添加、编辑、删除节点
```

- [ ] **Step 3: 提交代码**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
git add src/pages/Nodes.tsx
git commit -m "feat: 完善节点管理前端页面，支持增删改查操作"
```

---

## 模块3: 订阅和订单管理模块

### Task 3.1: 订阅计划管理

**Files:**
- Modify: `backend/src/subscription/subscription.controller.ts`
- Modify: `backend/src/subscription/subscription.service.ts`
- Modify: `admin-react-app/src/pages/SubscriptionPlans.tsx`

- [ ] **Step 1: 完善订阅计划Controller**

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  async getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Get('plans/:id')
  async getPlanById(@Param('id') id: string) {
    return this.subscriptionService.getPlanById(id);
  }

  @Get('plans/:id/subscribers')
  async getSubscribers(@Param('id') id: string) {
    return this.subscriptionService.getSubscribers(id);
  }

  @Post('plans')
  async createPlan(@Body() planData: any) {
    return this.subscriptionService.createPlan(planData);
  }

  @Put('plans/:id')
  async updatePlan(@Param('id') id: string, @Body() planData: any) {
    return this.subscriptionService.updatePlan(id, planData);
  }

  @Delete('plans/:id')
  async removePlan(@Param('id') id: string) {
    return this.subscriptionService.removePlan(id);
  }

  @Get('plans/stats')
  async getPlansStats() {
    return this.subscriptionService.getPlansStats();
  }
}
```

- [ ] **Step 2: 完善订阅计划Service**

```typescript
// backend/src/subscription/subscription.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { UserSubscription } from '../entities/user-subscription.entity';
import { User } from './user.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(UserSubscription)
    private subscriptionRepository: Repository<UserSubscription>,
  ) {}

  async createPlan(planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const plan = this.planRepository.create(planData);
    return this.planRepository.save(plan);
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    return this.planRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' }
    });
  }

  async findOne(id: string): Promise<SubscriptionPlan> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return plan;
  }

  async update(id: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    await this.planRepository.update(id, planData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.planRepository.delete(id);
  }

  async getPlansStats() {
    const plans = await this.planRepository.find();
    return {
      total: plans.length,
      active: plans.filter(p => p.isActive).length,
      inactive: plans.filter(p => !p.isActive).length,
      revenue: plans.reduce((sum, p) => sum + (p.price || 0), 0),
    };
  }

  async getSubscribers(planId: string) {
    const subscriptions = await this.subscriptionRepository.find({
      where: { subscriptionPlanId: planId },
      relations: ['user'],
    });
    return subscriptions.map(sub => ({
      id: sub.id,
      userId: sub.userId,
      userEmail: sub.user?.email,
      pricePaid: sub.pricePaid,
      status: sub.status,
      expiresAt: sub.expiresAt,
      createdAt: sub.createdAt,
    }));
  }
}
```

- [ ] **Step 3: 完善前端SubscriptionPlans页面**

更新 `admin-react-app/src/pages/SubscriptionPlans.tsx`，添加编辑、删除和查看订阅者功能：

```typescript
import { Table, Button, Space, Tag, Input, Modal, Form, Select, InputNumber } from 'antd';
import { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

interface SubscriptionPlanData {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  monthlyTraffic: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function SubscriptionPlans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPlanId, setViewingPlanId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [subscribersModalOpen, setSubscribersModalOpen] = useState(false);
  const [viewingSubscribersPlanId, setViewingSubscribersPlanId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/subscription/plans').then((res: any) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (values: any) => api.post('/subscription/plans', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsModalOpen(false);
      form.resetFields();
      window.location.reload();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: any) => api.put(`/subscription/plans/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      window.location.reload();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/subscription/plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      window.location.reload();
    },
  });

  const viewSubscribersMutation = useMutation({
    mutationFn: (id: string) => api.get(`/subscription/plans/${id}/subscribers`).then((res: any) => res.data),
    onSuccess: (data) => {
      setSubscribersData(data);
      setSubscribersModalOpen(true);
    },
  });

  const [subscribersData, setSubscribersData] = useState<any[]>([]);

  const columns = [
    {
      title: '计划ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: '计划名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '有效期',
      dataIndex: 'durationDays',
      key: 'durationDays',
      render: (duration: number) => `${duration}天`,
    },
    {
      title: '月流量',
      dataIndex: 'monthlyTraffic',
      key: 'monthlyTraffic',
      render: (traffic: number) => `${traffic}GB`,
    },
    {
      title: '显示顺序',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => <Tag color={isActive ? 'green' : 'red'}>{isActive ? '启用' : '禁用'}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              viewSubscribersMutation.mutate(record.id);
            }}
          >
            订阅者
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              setIsModalOpen(true);
              form.setFieldsValue(record);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除订阅计划 "${record.name}" 吗？`,
                onOk: () => deleteMutation.mutate(record.id),
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const subscribersColumns = [
    {
      title: '订阅ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: '用户邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: '支付金额',
      dataIndex: 'pricePaid',
      key: 'pricePaid',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>,
    },
    {
      title: '过期时间',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: '#ffffff', margin: '0 0 8px 0' }}>
          订阅计划
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="cyber-btn-primary"
        >
          添加计划
        </Button>
      </div>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
        />
      </div>

      <Modal
        title={editingId ? '编辑订阅计划' : '添加订阅计划'}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        className="cyber-modal"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="计划名称"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input className="cyber-input" placeholder="请输入计划名称" />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格（元/月）"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber className="cyber-input" placeholder="请输入价格" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="durationDays"
            label="有效期（天）"
            rules={[{ required: true, message: '请输入有效期' }]}
          >
            <InputNumber className="cyber-input" placeholder="请输入有效期天数" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="monthlyTraffic"
            label="月流量（GB）"
            rules={[{ required: true, message: '请输入月流量' }]}
          >
            <InputNumber className="cyber-input" placeholder="请输入月流量" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="displayOrder"
            label="显示顺序"
            rules={[{ required: true, message: '请输入显示顺序' }]}
          >
            <InputNumber className="cyber-input" placeholder="请输入显示顺序" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择状态"
            >
              <Select.Option value={true}>启用</Select.Option>
              <Select.Option value={false}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="订阅者列表"
        open={subscribersModalOpen}
        onCancel={() => setSubscribersModalOpen(false)}
        footer={null}
        className="cyber-modal"
        width={1000}
      >
        <Table
          columns={subscribersColumns}
          dataSource={subscribersData || []}
          rowKey="id"
          loading={isLoading}
        />
      </Modal>
    </div>
  );
}
```

- [ ] **Step 4: 运行测试验证**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
npm run dev
# 验证: http://localhost:5173/plans 页面正常显示，支持增删改查操作
```

- [ ] **Step 5: 提交代码**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
git add src/pages/SubscriptionPlans.tsx
git commit -m "feat: 完善订阅计划管理功能，支持增删改查和查看订阅者"
```

### Task 3.2: 订单管理

**Files:**
- Modify: `backend/src/order/order.controller.ts`
- Modify: `backend/src/order/order.service.ts`
- Modify: `admin-react-app/src/pages/Orders.tsx`

- [ ] **Step 1: 完善订单Controller**

```typescript
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '') {
    return this.orderService.findAll(page, limit, search);
  }

  @Get('search')
  async search(@Query('orderNumber') orderNumber: string, @Query('userId') userId: string) {
    return this.orderService.search(orderNumber, userId);
  }

  @Get('stats')
  async getStats() {
    return this.orderService.getStats();
  }

  @Get('by-user/:userId')
  async getOrdersByUser(@Param('userId') userId: string) {
    return this.orderService.getOrdersByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() orderData: any) {
    return this.orderService.update(id, orderData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @Post('update-status/:id')
  async updateStatus(@Param('id') id: string, @Body() statusData: any) {
    return this.orderService.updateStatus(id, statusData.status);
  }
}
```

- [ ] **Step 2: 完善订单Service**

```typescript
// backend/src/order/order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async findAll(page = 1, limit = 10, search = '') {
    const [orders, total] = await this.orderRepository.findAndCount({
      where: search ? {
        id: Like(`%${search}%`),
      } : undefined,
      relations: ['user', 'plan'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return {
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'plan'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(id: string, orderData: Partial<Order>): Promise<Order> {
    await this.orderRepository.update(id, orderData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async getStats() {
    const allOrders = await this.orderRepository.find();
    return {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === 'PENDING').length,
      paid: allOrders.filter(o => o.status === 'PAID').length,
      failed: allOrders.filter(o => o.status === 'FAILED').length,
      cancelled: allOrders.filter(o => o.status === 'CANCELLED').length,
      revenue: allOrders.filter(o => o.status === 'PAID').reduce((sum, o) => sum + o.amount, 0),
    };
  }

  async getOrdersByUser(userId: string) {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['plan'],
      order: { createdAt: 'DESC' }
    });
    return orders;
  }
}
```

- [ ] **Step 3: 完善前端Orders页面**

更新 `admin-react-app/src/pages/Orders.tsx`，添加编辑和删除功能：

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Button, Space, Tag, Input, Modal, Form, Select, message } from 'antd';
import { useState } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export default function Orders() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['orders', 1, 10, searchText, statusFilter],
    queryFn: () => api.get(`/orders?page=1&limit=10&search=${searchText}&status=${statusFilter}`).then((res: any) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (values: any) => api.post('/orders', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsModalOpen(false);
      form.resetFields();
      window.location.reload();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: any) => api.put(`/orders/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      window.location.reload();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/orders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      message.success('订单删除成功');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: any) => api.put(`/orders/update-status/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      message.success('订单状态更新成功');
    },
  });

  const columns = [
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'orderNumber',
      render: (id: string) => <Tag color="cyan">{id.substring(0, 8)}</Tag>,
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => user?.email || '-',
    },
    {
      title: '订阅计划',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan: string) => plan ? <Tag color="blue">{plan}</Tag> : '-',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Select
          value={status}
          onChange={(newStatus) => updateStatusMutation.mutate({ id: status, newStatus })}
          size="small"
        >
          <Select.Option value="PENDING">待支付</Select.Option>
          <Select.Option value="PAID">已支付</Select.Option>
          <Select.Option value="FAILED">支付失败</Select.Option>
          <Select.Option value="CANCELLED">已取消</Select.Option>
        </Select>
      ),
    },
    {
      title: '支付时间',
      dataIndex: 'paidAt',
      key: 'paidAt',
      render: (date: string) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              setIsModalOpen(true);
              form.setFieldsValue({
                amount: record.amount,
                paymentMethod: record.paymentMethod,
                status: record.status,
                paidAt: record.paidAt,
              });
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除订单 "${record.id.substring(0, 8)}" 吗？`,
                onOk: () => deleteMutation.mutate(record.id),
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#ffffff', margin: '0 0 16px 0' }}>
        订单管理
      </h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          className="cyber-input"
          placeholder="搜索订单号或用户"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
        >
          <Select.Option value="all">全部状态</Select.Option>
          <Select.Option value="PENDING">待支付</Select.Option>
          <Select.Option value="PAID">已支付</Select.Option>
          <Select.Option value="FAILED">支付失败</Select.Option>
          <Select.Option value="CANCELLED">已取消</Select.Option>
        </Select>
        <Button type="primary" className="cyber-btn-primary">
          添加订单
        </Button>
        <Button type="default" onClick={() => queryClient.invalidateQueries({ queryKey: ['orders'] })}>
          刷新
        </Button>
      </Space>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: data?.page,
            pageSize: data?.limit,
            total: data?.total,
            onChange: (page) => {
              const newData = api.get(`/orders?page=${page}&limit=10&search=${searchText}&status=${statusFilter}`).then((res: any) => res.data);
              newData.then(data => {
                setPagination({ current: data.page });
                setOrdersData(data);
              });
            },
          }}
        />
      </div>

      <Modal
        title={editingId ? '编辑订单' : '添加订单'}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        className="cyber-modal"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="amount"
            label="金额（元）"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <Input className="cyber-input" placeholder="请输入金额" type="number" />
          </Form.Item>

          <Form.Item
            name="paymentMethod"
            label="支付方式"
            rules={[{ required: true, message: '请选择支付方式' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择支付方式"
            >
              <Select.Option value="alipay">支付宝</Select.Option>
              <Select.Option value="wechat">微信支付</Select.Option>
              <Select.Option value="balance">余额支付</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="订单状态"
            rules={[{ required: true, message: '请选择订单状态' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择订单状态"
            >
              <Select.Option value="PENDING">待支付</Select.Option>
              <Select.Option value="PAID">已支付</Select.Option>
              <Select.Option value="FAILED">支付失败</Select.Option>
              <Select.Option value="CANCELLED">已取消</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="payUrl"
            label="支付链接"
            rules={[{ required: false, message: '请输入支付链接' }]}
          >
            <Input className="cyber-input" placeholder="请输入支付链接" />
          </Form.Item>

          <Form.Item
            name="paidAt"
            label="支付时间"
            rules={[{ required: false, message: '请输入支付时间' }]}
          >
            <Input className="cyber-input" type="datetime-local" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 4: 运行测试验证**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
npm run dev
# 验证: http://localhost:5173/orders 页面正常显示，支持增删改查操作
```

- [ ] **Step 5: 提交代码**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
git add src/pages/Orders.tsx
git commit -m "feat: 完善订单管理功能，支持增删改查和状态更新"
```

---

## 模块4: 连接和系统管理模块

### Task 4.1: VPN配置管理

**Files:**
- Create: `backend/src/vpn-config/vpn-config.controller.ts`
- Create: `backend/src/vpn-config/vpn-config.service.ts`
- Create: `backend/src/entities/vpn-config.entity.ts`
- Create: `admin-react-app/src/pages/VpnConfigurations.tsx`

- [ ] **Step 1: 创建VPN配置实体**

```typescript
// backend/src/entities/vpn-config.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Node } from './node.entity';

@Entity('vpn_configurations')
@Index(['userId'])
@Index(['nodeId'])
export class VpnConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column()
  userId: string = "";

  @Column()
  nodeId: string = "";

  @Column()
  protocol: string = "";

  @Column()
  address: string = "";

  @Column()
  port: number = 0;

  @Column()
  path: string = "";

  @Column()
  serverName: string = "";

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();

  @ManyToOne(() => User, user => user.connections)
  user: User | null;

  @ManyToOne(() => Node, node => node.configurations)
  node: Node | null;
}
```

- [ ] **Step 2: 创建VPN配置Service**

```typescript
// backend/src/vpn-config/vpn-config.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VpnConfiguration } from '../entities/vpn-config.entity';

@Injectable()
export class VpnConfigService {
  constructor(
    @InjectRepository(VpnConfiguration)
    private configRepository: Repository<VpnConfiguration>,
  ) {}

  async create(configData: Partial<VpnConfiguration>): Promise<VpnConfiguration> {
    const config = this.configRepository.create(configData);
    return this.configRepository.save(config);
  }

  async findAll(): Promise<VpnConfiguration[]> {
    return this.configRepository.find({
      relations: ['user', 'node'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUser(userId: string): Promise<VpnConfiguration[]> {
    return this.configRepository.find({
      where: { userId },
      relations: ['node'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<VpnConfiguration> {
    const config = await this.configRepository.findOne({
      where: { id },
      relations: ['user', 'node'],
    });
    if (!config) {
      throw new NotFoundException('VPN Configuration not found');
    }
    return config;
  }

  async update(id: string, configData: Partial<VpnConfiguration>): Promise<VpnConfiguration> {
    await this.configRepository.update(id, configData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.configRepository.delete(id);
  }

  async getStats() {
    const configs = await this.configRepository.find();
    return {
      total: configs.length,
      byUser: configs.reduce((acc, config) => {
        acc[config.userId] = (acc[config.userId] || 0) + 1;
        return acc;
      }, {}),
      byNode: configs.reduce((acc, config) => {
        acc[config.nodeId] = (acc[config.nodeId] || 0) + 1;
        return acc;
      }, {}),
    };
  }
}
```

- [ ] **Step 3: 创建VPN配置Controller**

```typescript
// backend/src/vpn-config/vpn-config.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { VpnConfigService } from './vpn-config.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vpn-configurations')
@UseGuards(JwtAuthGuard)
export class VpnConfigController {
  constructor(private readonly vpnConfigService: VpnConfigService) {}

  @Get()
  async findAll() {
    return this.vpnConfigService.findAll();
  }

  @Get('my')
  async getMyConfigurations(@Request() req: any) {
    return this.vpnConfigService.findByUser(req.user.id);
  }

  @Get('stats')
  async getStats() {
    return this.vpnConfigService.getStats();
  }

  @Post()
  async create(@Body() configData: any, @Request() req: any) {
    return this.vpnConfigService.create({ ...configData, userId: req.user.id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() configData: any) {
    return this.vpnConfigService.update(id, configData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.vpnConfigService.remove(id);
  }
}
```

- [ ] **Step 4: 创建前端VPN配置页面**

```typescript
// admin-react-app/src/pages/VpnConfigurations.tsx
import { Table, Button, Space, Tag, Modal, Form, Input } from 'antd';
import { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

interface VpnConfigData {
  id: string;
  userId: string;
  nodeId: string;
  protocol: string;
  address: string;
  port: number;
  path: string;
  serverName: string;
  createdAt: string;
}

export default function VpnConfigurations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['vpn-configurations'],
    queryFn: () => api.get('/vpn-configurations').then((res: any) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (values: any) => api.post('/vpn-configurations', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vpn-configurations'] });
      setIsModalOpen(false);
      form.resetFields();
      window.location.reload();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: any) => api.put(`/vpn-configurations/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vpn-configurations'] });
      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      window.location.reload();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/vpn-configurations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vpn-configurations'] });
      window.location.reload();
    },
  });

  const columns = [
    {
      title: '配置ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 200,
    },
    {
      title: '节点ID',
      dataIndex: 'nodeId',
      key: 'nodeId',
      width: 200,
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (protocol: string) => <Tag color="purple">{protocol.toUpperCase()}</Tag>,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
    },
    {
      title: '服务器名称',
      dataIndex: 'serverName',
      key: 'serverName',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              setIsModalOpen(true);
              form.setFieldsValue(record);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除VPN配置 "${record.id}" 吗？`,
                onOk: () => deleteMutation.mutate(record.id),
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: '#ffffff', margin: '0 0 8px 0' }}>
          VPN配置管理
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="cyber-btn-primary"
        >
          添加配置
        </Button>
      </div>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
        />
      </div>

      <Modal
        title={editingId ? '编辑VPN配置' : '添加VPN配置'}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        className="cyber-modal"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="userId"
            label="用户ID"
            rules={[{ required: true, message: '请输入用户ID' }]}
          >
            <Input className="cyber-input" placeholder="请输入用户ID" />
          </Form.Item>

          <Form.Item
            name="nodeId"
            label="节点ID"
            rules={[{ required: true, message: '请输入节点ID' }]}
          >
            <Input className="cyber-input" placeholder="请输入节点ID" />
          </Form.Item>

          <Form.Item
            name="protocol"
            label="协议类型"
            rules={[{ required: true, message: '请选择协议类型' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择协议类型"
            >
              <Select.Option value="vmess">VMess</Select.Option>
              <Select.Option value="vless">VLESS</Select.Option>
              <Select.Option value="trojan">Trojan</Select.Option>
              <Select.Option value="ss">Shadowsocks</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="节点地址"
            rules={[{ required: true, message: '请输入节点地址' }]}
          >
            <Input className="cyber-input" placeholder="请输入节点地址" />
          </Form.Item>

          <Form.Item
            name="port"
            label="端口"
            rules={[{ required: true, message: '请输入端口' }]}
          >
            <Input className="cyber-input" placeholder="请输入端口" type="number" />
          </Form.Item>

          <Form.Item
            name="path"
            label="路径"
            rules={[{ required: false, message: '请输入路径' }]}
          >
            <Input className="cyber-input" placeholder="请输入路径" />
          </Form.Item>

          <Form.Item
            name="serverName"
            label="服务器名称"
            rules={[{ required: false, message: '请输入服务器名称' }]}
          >
            <Input className="cyber-input" placeholder="请输入服务器名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 5: 更新App.tsx路由**

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Nodes from './pages/Nodes';
import Orders from './pages/Orders';
import SubscriptionPlans from './pages/SubscriptionPlans';
import VpnConfigurations from './pages/VpnConfigurations';
import Logs from './pages/Logs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="nodes" element={<Nodes />} />
          <Route path="orders" element={<Orders />} />
          <Route path="plans" element={<SubscriptionPlans />} />
          <Route path="vpn-configurations" element={<VpnConfigurations />} />
          <Route path="logs" element={<Logs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
```

- [ ] **Step 6: 运行测试验证**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
npm run dev
# 验证: http://localhost:5173/vpn-configurations 页面正常显示
```

- [ ] **Step 7: 提交代码**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
git add src/pages/VpnConfigurations.tsx src/App.tsx
git commit -m "feat: 添加VPN配置管理功能"
```

### Task 4.2: 连接日志管理

**Files:**
- Create: `backend/src/connection-log/connection-log.controller.ts`
- Create: `backend/src/connection-log/connection-log.service.ts`
- Create: `backend/src/entities/connection-log.entity.ts`
- Create: `admin-react-app/src/pages/ConnectionLogs.tsx`

- [ ] **Step 1: 创建连接日志实体**

```typescript
// backend/src/entities/connection-log.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Node } from './node.entity';

@Entity('connection_logs')
@Index(['userId'])
@Index(['nodeId'])
export class ConnectionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column()
  userId: string = "";

  @Column()
  nodeId: string = "";

  @Column('timestamp')
  connectAt: Date = new Date();

  @Column({ nullable: true })
  disconnectAt: Date = new Date();

  @Column({ type: 'integer' })
  duration: number = 0;

  @Column({ type: 'bigint' })
  traffic: number = 0;

  @Column({
    type: 'enum',
    enum: ['connected', 'disconnected', 'failed'],
    default: 'connected'
  })
  status: string = "";

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();

  @ManyToOne(() => User, user => user.subscriptions)
  user: User | null;

  @ManyToOne(() => Node, node => node.connections)
  node: Node | null;
}
```

- [ ] **Step 2: 创建连接日志Service**

```typescript
// backend/src/connection-log/connection-log.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectionLog } from '../entities/connection-log.entity';

@Injectable()
export class ConnectionLogService {
  constructor(
    @InjectRepository(ConnectionLog)
    private logRepository: Repository<ConnectionLog>,
  ) {}

  async create(logData: Partial<ConnectionLog>): Promise<ConnectionLog> {
    const log = this.logRepository.create(logData);
    return this.logRepository.save(log);
  }

  async findAll(): Promise<ConnectionLog[]> {
    return this.logRepository.find({
      relations: ['user', 'node'],
      order: { connectAt: 'DESC' }
    });
  }

  async findByUser(userId: string): Promise<ConnectionLog[]> {
    return this.logRepository.find({
      where: { userId },
      relations: ['node'],
      order: { connectAt: 'DESC' }
    });
  }

  async findByNode(nodeId: string): Promise<ConnectionLog[]> {
    return this.logRepository.find({
      where: { nodeId },
      relations: ['user'],
      order: { connectAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<ConnectionLog> {
    const log = await this.logRepository.findOne({
      where: { id },
      relations: ['user', 'node'],
    });
    if (!log) {
      throw new NotFoundException('Connection log not found');
    }
    return log;
  }

  async update(id: string, logData: Partial<ConnectionLog>): Promise<ConnectionLog> {
    await this.logRepository.update(id, logData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.logRepository.delete(id);
  }

  async getStats() {
    const logs = await this.logRepository.find();
    return {
      total: logs.length,
      byUser: logs.reduce((acc, log) => {
        acc[log.userId] = (acc[log.userId] || 0) + 1;
        return acc;
      }, {}),
      byNode: logs.reduce((acc, log) => {
        acc[log.nodeId] = (acc[log.nodeId] || 0) + 1;
        return acc;
      }, {}),
      totalDuration: logs.reduce((sum, log) => sum + log.duration, 0),
      totalTraffic: logs.reduce((sum, log) => sum + Number(log.traffic), 0),
    };
  }

  async getDailyStats() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayLogs = await this.logRepository.find({
      where: {
        connectAt: Between(today, new Date(today.setHours(23, 59, 59, 999)))
      }
    });

    const yesterdayLogs = await this.logRepository.find({
      where: {
        connectAt: Between(
          new Date(yesterday),
          new Date(yesterday.setHours(23, 59, 59, 999))
        )
      }
    });

    return {
      today: todayLogs.length,
      yesterday: yesterdayLogs.length,
      todayDuration: todayLogs.reduce((sum, log) => sum + log.duration, 0),
      yesterdayDuration: yesterdayLogs.reduce((sum, log) => sum + log.duration, 0),
    };
  }
}
```

- [ ] **Step 3: 创建连接日志Controller**

```typescript
// backend/src/connection-log/connection-log.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ConnectionLogService } from './connection-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('connection-logs')
@UseGuards(JwtAuthGuard)
export class ConnectionLogController {
  constructor(private readonly connectionLogService: ConnectionLogService) {}

  @Get()
  async findAll() {
    return this.connectionLogService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.connectionLogService.getStats();
  }

  @Get('daily-stats')
  async getDailyStats() {
    return this.connectionLogService.getDailyStats();
  }

  @Get('by-user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.connectionLogService.findByUser(userId);
  }

  @Get('by-node/:nodeId')
  async getByNode(@Param('nodeId') nodeId: string) {
    return this.connectionLogService.findByNode(nodeId);
  }

  @Get('daily-stats/:date')
  async getDailyStatsByDate(@Param('date') date: string) {
    const specificDate = new Date(date);
    const logs = await this.connectionLogService.findAll();
    const filteredLogs = logs.filter(log => {
      const logDate = new Date(log.connectAt);
      return logDate.toDateString() === specificDate.toDateString();
    });
    return {
      date: date,
      logs: filteredLogs,
      duration: filteredLogs.reduce((sum, log) => sum + log.duration, 0),
      traffic: filteredLogs.reduce((sum, log) => sum + Number(log.traffic), 0),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.connectionLogService.findOne(id);
  }

  @Post()
  async create(@Body() logData: any, @Request() req: any) {
    return this.connectionLogService.create({ ...logData, userId: req.user.id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() logData: any) {
    return this.connectionLogService.update(id, logData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.connectionLogService.remove(id);
  }
}
```

- [ ] **Step 4: 创建前端连接日志页面**

```typescript
// admin-react-app/src/pages/ConnectionLogs.tsx
import { Table, Button, Space, Tag, Modal, Form, Input, DatePicker, Statistic, Row, Col, Select } from 'antd';
import { useState } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface ConnectionLogData {
  id: string;
  userId: string;
  nodeId: string;
  connectAt: string;
  disconnectAt: string | null;
  duration: number;
  traffic: number;
  status: string;
  user?: any;
  node?: any;
}

export default function ConnectionLogs() {
  const [searchText, setSearchText] = useState('');
  const [userIdFilter, setUserIdFilter] = useState<string>('');
  const [nodeIdFilter, setNodeIdFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['connection-logs', searchText, userIdFilter, nodeIdFilter, dateFilter],
    queryFn: () => api.get(`/connection-logs`).then((res: any) => res.data),
  });

  const dailyStatsQuery = useQuery({
    queryKey: ['connection-logs-daily-stats'],
    queryFn: () => api.get('/connection-logs/daily-stats').then((res: any) => res.data),
  });

  const columns = [
    {
      title: '日志ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 200,
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => user?.email || '-',
    },
    {
      title: '节点ID',
      dataIndex: 'nodeId',
      key: 'nodeId',
      width: 200,
    },
    {
      title: '节点',
      dataIndex: 'node',
      key: 'node',
      render: (node: any) => node?.name || '-',
    },
    {
      title: '连接时间',
      dataIndex: 'connectAt',
      key: 'connectAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '断开时间',
      dataIndex: 'disconnectAt',
      key: 'disconnectAt',
      render: (date: string | null) => date ? new Date(date).toLocaleString('zh-CN') : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'connected' ? 'green' : status === 'disconnected' ? 'blue' : 'red'}>{status}</Tag>,
    },
    {
      title: '时长（秒）',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => duration.toLocaleString(),
    },
    {
      title: '流量',
      dataIndex: 'traffic',
      key: 'traffic',
      render: (traffic: number) => `${(traffic / 1024 / 1024).toFixed(2)} MB`,
    },
  ];

  return (
    <div>
      <h2 style={{ color: '#ffffff', margin: '0 0 16px 0' }}>
        连接日志管理
      </h2>

      <div style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            className="cyber-input"
            placeholder="搜索用户ID"
            prefix={<SearchOutlined />}
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            style={{ width: 200 }}
          />
          <Input
            className="cyber-input"
            placeholder="搜索节点ID"
            prefix={<SearchOutlined />}
            value={nodeIdFilter}
            onChange={(e) => setNodeIdFilter(e.target.value)}
            style={{ width: 200 }}
          />
          <DatePicker
            placeholder="日期筛选"
            style={{ width: 200 }}
            value={dateFilter ? new Date(dateFilter) : undefined}
            onChange={(date) => setDateFilter(date ? date.toISOString() : '')}
          />
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => refetch()}>
            查询
          </Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic
            title="总日志数"
            value={data?.total || 0}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="今日日志"
            value={dailyStatsQuery.data?.today || 0}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="总时长（秒）"
            value={data?.totalDuration || 0}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
      </Row>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 2000 }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 更新App.tsx路由**

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Nodes from './pages/Nodes';
import Orders from './pages/Orders';
import SubscriptionPlans from './pages/SubscriptionPlans';
import VpnConfigurations from './pages/VpnConfigurations';
import ConnectionLogs from './pages/ConnectionLogs';
import SystemLogs from './pages/SystemLogs';
import Logs from './pages/Logs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="nodes" element={<Nodes />} />
          <Route path="orders" element={<Orders />} />
          <Route path="plans" element={<SubscriptionPlans />} />
          <Route path="vpn-configurations" element={<VpnConfigurations />} />
          <Route path="connection-logs" element={<ConnectionLogs />} />
          <Route path="system-logs" element={<SystemLogs />} />
          <Route path="logs" element={<Logs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
```

- [ ] **Step 6: 运行测试验证**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
npm run dev
# 验证: http://localhost:5173/connection-logs 页面正常显示
```

- [ ] **Step 7: 提交代码**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
git add src/pages/ConnectionLogs.tsx src/App.tsx
git commit -m "feat: 添加连接日志管理功能"
```

### Task 4.3: 系统日志管理

**Files:**
- Create: `backend/src/system-log/system-log.controller.ts`
- Create: `backend/src/system-log/system-log.service.ts`
- Create: `backend/src/entities/system-log.entity.ts`
- Create: `admin-react-app/src/pages/SystemLogs.tsx`

- [ ] **Step 1: 创建系统日志实体**

```typescript
// backend/src/entities/system-log.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('system_logs')
@Index(['level'])
@Index(['userId'])
@Index(['ipAddress'])
@Index(['created_at'])
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column({
    type: 'enum',
    enum: ['INFO', 'WARNING', 'ERROR'],
    default: 'INFO'
  })
  level: string = "";

  @Column()
  message: string = "";

  @Column({ nullable: true })
  errorCode: string = "";

  @Column({ nullable: true })
  userId: string = "";

  @Column({ nullable: true })
  ipAddress: string = "";

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();
}
```

- [ ] **Step 2: 创建系统日志Service**

```typescript
// backend/src/system-log/system-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLog } from '../entities/system-log.entity';

@Injectable()
export class SystemLogService {
  constructor(
    @InjectRepository(SystemLog)
    private logRepository: Repository<SystemLog>,
  ) {}

  async create(logData: Partial<SystemLog>): Promise<SystemLog> {
    const log = this.logRepository.create(logData);
    return this.logRepository.save(log);
  }

  async findAll(): Promise<SystemLog[]> {
    return this.logRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findByLevel(level: string): Promise<SystemLog[]> {
    return this.logRepository.find({
      where: { level },
      order: { createdAt: 'DESC' }
    });
  }

  async findByUser(userId: string): Promise<SystemLog[]> {
    return this.logRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findByIP(ipAddress: string): Promise<SystemLog[]> {
    return this.logRepository.find({
      where: { ipAddress },
      order: { createdAt: 'DESC' }
    });
  }

  async getStats() {
    const logs = await this.logRepository.find();
    return {
      total: logs.length,
      info: logs.filter(l => l.level === 'INFO').length,
      warning: logs.filter(l => l.level === 'WARNING').length,
      error: logs.filter(l => l.level === 'ERROR').length,
      byLevel: logs.reduce((acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  async getRecentLogs(limit = 100): Promise<SystemLog[]> {
    return this.logRepository.find({
      order: { createdAt: 'DESC' },
      take: limit
    });
  }

  async getLogsByTimeRange(start: Date, end: Date): Promise<SystemLog[]> {
    return this.logRepository.find({
      where: {
        createdAt: Between(start, end)
      },
      order: { createdAt: 'DESC' }
    });
  }

  async remove(id: string): Promise<void> {
    await this.logRepository.delete(id);
  }
}
```

- [ ] **Step 3: 创建系统日志Controller**

```typescript
// backend/src/system-log/system-log.controller.ts
import { Controller, Get, Post, Delete, Param, UseGuards, Query, Request } from '@nestjs/common';
import { SystemLogService } from './system-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('system-logs')
@UseGuards(JwtAuthGuard)
export class SystemLogController {
  constructor(private readonly systemLogService: SystemLogService) {}

  @Get()
  async findAll() {
    return this.systemLogService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.systemLogService.getStats();
  }

  @Get('recent')
  async getRecent(@Query('limit') limit = 100) {
    return this.systemLogService.getRecentLogs(limit);
  }

  @Get('by-level/:level')
  async getByLevel(@Param('level') level: string) {
    return this.systemLogService.findByLevel(level);
  }

  @Get('by-user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.systemLogService.findByUser(userId);
  }

  @Get('by-ip/:ipAddress')
  async getByIP(@Param('ipAddress') ipAddress: string) {
    return this.systemLogService.findByIP(ipAddress);
  }

  @Get('by-time-range')
  async getByTimeRange(@Query('start') start: string, @Query('end') end: string) {
    return this.systemLogService.getLogsByTimeRange(
      new Date(start),
      new Date(end)
    );
  }

  @Post()
  async create(@Body() logData: any, @Request() req: any) {
    return this.systemLogService.create({
      ...logData,
      level: logData.level || 'INFO',
      userId: req.user?.id || logData.userId,
      ipAddress: req.ip || logData.ipAddress,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.systemLogService.remove(id);
  }
}
```

- [ ] **Step 4: 创建前端系统日志页面**

```typescript
// admin-react-app/src/pages/SystemLogs.tsx
import { Table, Button, Space, Tag, Input, Modal, Form, Select, DatePicker, Row, Col, Statistic } from 'antd';
import { useState } from 'react';
import { SearchOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface SystemLogData {
  id: string;
  level: string;
  message: string;
  errorCode: string;
  userId: string;
  ipAddress: string;
  createdAt: string;
}

export default function SystemLogs() {
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [userIdFilter, setUserIdFilter] = useState<string>('');
  const [messageFilter, setMessageFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['system-logs', levelFilter, userIdFilter, messageFilter, dateRange],
    queryFn: () => api.get(`/system-logs`).then((res: any) => res.data),
  });

  const statsQuery = useQuery({
    queryKey: ['system-logs-stats'],
    queryFn: () => api.get('/system-logs/stats').then((res: any) => res.data),
  });

  const columns = [
    {
      title: '日志ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={level === 'INFO' ? 'blue' : level === 'WARNING' ? 'orange' : 'red'}>
          {level}
        </Tag>
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '错误代码',
      dataIndex: 'errorCode',
      key: 'errorCode',
      render: (errorCode: string) => errorCode || '-',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
  ];

  return (
    <div>
      <h2 style={{ color: '#ffffff', margin: '0 0 16px 0' }}>
        系统日志管理
      </h2>

      <div style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Select
            value={levelFilter}
            onChange={setLevelFilter}
            style={{ width: 150 }}
          >
            <Select.Option value="all">全部级别</Select.Option>
            <Select.Option value="INFO">INFO</Select.Option>
            <Select.Option value="WARNING">WARNING</Select.Option>
            <Select.Option value="ERROR">ERROR</Select.Option>
          </Select>
          <Input
            className="cyber-input"
            placeholder="搜索用户ID"
            prefix={<SearchOutlined />}
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            style={{ width: 200 }}
          />
          <Input
            className="cyber-input"
            placeholder="搜索消息内容"
            prefix={<SearchOutlined />}
            value={messageFilter}
            onChange={(e) => setMessageFilter(e.target.value)}
            style={{ width: 300 }}
          />
          <DatePicker.RangePicker
            placeholder={['开始日期', '结束日期']}
            style={{ width: 400 }}
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Date, Date] | null)}
          />
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => refetch()}>
            查询
          </Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic
            title="总日志数"
            value={statsQuery.data?.total || 0}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="INFO日志"
            value={statsQuery.data?.info || 0}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="ERROR日志"
            value={statsQuery.data?.error || 0}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
      </Row>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 2000 }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 更新App.tsx路由**

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Nodes from './pages/Nodes';
import Orders from './pages/Orders';
import SubscriptionPlans from './pages/SubscriptionPlans';
import VpnConfigurations from './pages/VpnConfigurations';
import ConnectionLogs from './pages/ConnectionLogs';
import SystemLogs from './pages/SystemLogs';
import Logs from './pages/Logs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="nodes" element={<Nodes />} />
          <Route path="orders" element={<Orders />} />
          <Route path="plans" element={<SubscriptionPlans />} />
          <Route path="vpn-configurations" element={<VpnConfigurations />} />
          <Route path="connection-logs" element={<ConnectionLogs />} />
          <Route path="system-logs" element={<SystemLogs />} />
          <Route path="logs" element={<Logs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
```

- [ ] **Step 6: 运行测试验证**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
npm run dev
# 验证: http://localhost:5173/system-logs 页面正常显示
```

- [ ] **Step 7: 提交代码**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
git add src/pages/SystemLogs.tsx src/App.tsx
git commit -m "feat: 添加系统日志管理功能"
```

---

## 模块4.4: 完成用户订阅管理

**Files:**
- Modify: `backend/src/entities/user-subscription.entity.ts`
- Create: `backend/src/user-subscription/user-subscription.controller.ts`
- Create: `backend/src/user-subscription/user-subscription.service.ts`
- Create: `admin-react-app/src/pages/UserSubscriptions.tsx`

- [ ] **Step 1: 完善用户订阅实体**

确保 `backend/src/entities/user-subscription.entity.ts` 存在并正确：

```typescript
// backend/src/entities/user-subscription.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('user_subscriptions')
@Index(['userId'])
@Index(['subscriptionPlanId'])
@Index(['expiresAt'])
export class UserSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column()
  userId: string = "";

  @Column()
  subscriptionPlanId: string = "";

  @Column('decimal', { precision: 10, scale: 2 })
  pricePaid: number = 0;

  @Column()
  status: string = "";

  @Column({ nullable: true })
  expiresAt: Date = new Date();

  @Column({ type: 'bigint', default: '0' })
  trafficUsed: number = 0;

  @Column({ type: 'bigint', default: '0' })
  trafficLimit: number = 0;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();

  @ManyToOne(() => User, user => user.subscriptions)
  user: User | null;

  @ManyToOne(() => SubscriptionPlan, plan => plan.subscriptions)
  plan: SubscriptionPlan | null;
}
```

- [ ] **Step 2: 创建用户订阅Service**

```typescript
// backend/src/user-subscription/user-subscription.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscription } from '../entities/user-subscription.entity';

@Injectable()
export class UserSubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private subscriptionRepository: Repository<UserSubscription>,
  ) {}

  async create(subscriptionData: Partial<UserSubscription>): Promise<UserSubscription> {
    const subscription = this.subscriptionRepository.create(subscriptionData);
    return this.subscriptionRepository.save(subscription);
  }

  async findAll(): Promise<UserSubscription[]> {
    return this.subscriptionRepository.find({
      relations: ['user', 'plan'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUser(userId: string): Promise<UserSubscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      relations: ['plan'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByPlan(planId: string): Promise<UserSubscription[]> {
    return this.subscriptionRepository.find({
      where: { subscriptionPlanId: planId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<UserSubscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'plan'],
    });
    if (!subscription) {
      throw new NotFoundException('User subscription not found');
    }
    return subscription;
  }

  async update(id: string, subscriptionData: Partial<UserSubscription>): Promise<UserSubscription> {
    await this.subscriptionRepository.update(id, subscriptionData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }

  async getStats() {
    const subscriptions = await this.subscriptionRepository.find();
    return {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'ACTIVE').length,
      expired: subscriptions.filter(s => s.status === 'EXPIRED').length,
      cancelled: subscriptions.filter(s => s.status === 'CANCELLED').length,
      revenue: subscriptions.reduce((sum, s) => sum + s.pricePaid, 0),
      totalTrafficUsed: subscriptions.reduce((sum, s) => sum + Number(s.trafficUsed), 0),
      totalTrafficLimit: subscriptions.reduce((sum, s) => sum + Number(s.trafficLimit), 0),
    };
  }

  async getActiveSubscriptions(): Promise<UserSubscription[]> {
    const now = new Date();
    return this.subscriptionRepository.find({
      where: {
        status: 'ACTIVE',
        expiresAt: Between(now, new Date(now.setMonth(now.getMonth() + 1)))
      },
      relations: ['user', 'plan'],
    });
  }

  async getExpiredSubscriptions(): Promise<UserSubscription[]> {
    const now = new Date();
    return this.subscriptionRepository.find({
      where: {
        status: 'ACTIVE',
        expiresAt: Between(now, new Date(now.setMonth(now.getMonth() + 6)))
      },
      relations: ['user', 'plan'],
    });
  }
}
```

- [ ] **Step 3: 创建用户订阅Controller**

```typescript
// backend/src/user-subscription/user-subscription.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { UserSubscriptionService } from './user-subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-subscriptions')
@UseGuards(JwtAuthGuard)
export class UserSubscriptionController {
  constructor(private readonly userSubscriptionService: UserSubscriptionService) {}

  @Get()
  async findAll() {
    return this.userSubscriptionService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.userSubscriptionService.getStats();
  }

  @Get('active')
  async getActiveSubscriptions() {
    return this.userSubscriptionService.getActiveSubscriptions();
  }

  @Get('expiring')
  async getExpiringSubscriptions() {
    return this.userSubscriptionService.getExpiredSubscriptions();
  }

  @Get('by-user/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.userSubscriptionService.findByUser(userId);
  }

  @Get('by-plan/:planId')
  async getByPlan(@Param('planId') planId: string) {
    return this.userSubscriptionService.findByPlan(planId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userSubscriptionService.findOne(id);
  }

  @Post()
  async create(@Body() subscriptionData: any, @Request() req: any) {
    return this.userSubscriptionService.create({
      ...subscriptionData,
      userId: req.user.id,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() subscriptionData: any) {
    return this.userSubscriptionService.update(id, subscriptionData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userSubscriptionService.remove(id);
  }
}
```

- [ ] **Step 4: 创建前端用户订阅页面**

```typescript
// admin-react-app/src/pages/UserSubscriptions.tsx
import { Table, Button, Space, Tag, Modal, Form, Input, DatePicker, Row, Col, Statistic } from 'antd';
import { useState } from 'react';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface UserSubscriptionData {
  id: string;
  userId: string;
  subscriptionPlanId: string;
  pricePaid: number;
  status: string;
  expiresAt: string;
  trafficUsed: number;
  trafficLimit: number;
  createdAt: string;
  user?: any;
  plan?: any;
}

export default function UserSubscriptions() {
  const [userIdFilter, setUserIdFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user-subscriptions', userIdFilter, statusFilter, dateRange],
    queryFn: () => api.get(`/user-subscriptions`).then((res: any) => res.data),
  });

  const statsQuery = useQuery({
    queryKey: ['user-subscriptions-stats'],
    queryFn: () => api.get('/user-subscriptions/stats').then((res: any) => res.data),
  });

  const columns = [
    {
      title: '订阅ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 200,
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => user?.email || '-',
    },
    {
      title: '订阅计划ID',
      dataIndex: 'subscriptionPlanId',
      key: 'subscriptionPlanId',
      width: 200,
    },
    {
      title: '计划名称',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan: any) => plan?.name || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : status === 'EXPIRED' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '过期时间',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '已用流量',
      dataIndex: 'trafficUsed',
      key: 'trafficUsed',
      render: (trafficUsed: number, record: any) => `${trafficUsed} / ${record.trafficLimit}`,
    },
    {
      title: '支付金额',
      dataIndex: 'pricePaid',
      key: 'pricePaid',
      render: (pricePaid: number) => `¥${pricePaid.toFixed(2)}`,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
  ];

  return (
    <div>
      <h2 style={{ color: '#ffffff', margin: '0 0 16px 0' }}>
        用户订阅管理
      </h2>

      <div style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            className="cyber-input"
            placeholder="搜索用户ID"
            prefix={<SearchOutlined />}
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Select.Option value="all">全部状态</Select.Option>
            <Select.Option value="ACTIVE">活跃</Select.Option>
            <Select.Option value="EXPIRED">已过期</Select.Option>
            <Select.Option value="CANCELLED">已取消</Select.Option>
          </Select>
          <DatePicker.RangePicker
            placeholder={['开始日期', '结束日期']}
            style={{ width: 400 }}
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Date, Date] | null)}
          />
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => refetch()}>
            查询
          </Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic
            title="总订阅数"
            value={statsQuery.data?.total || 0}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="活跃订阅"
            value={statsQuery.data?.active || 0}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="总收益（元）"
            value={statsQuery.data?.revenue || 0}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
      </Row>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 2000 }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 更新App.tsx路由**

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Nodes from './pages/Nodes';
import Orders from './pages/Orders';
import SubscriptionPlans from './pages/SubscriptionPlans';
import VpnConfigurations from './pages/VpnConfigurations';
import ConnectionLogs from './pages/ConnectionLogs';
import SystemLogs from './pages/SystemLogs';
import UserSubscriptions from './pages/UserSubscriptions';
import Logs from './pages/Logs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="nodes" element={<Nodes />} />
          <Route path="orders" element={<Orders />} />
          <Route path="plans" element={<SubscriptionPlans />} />
          <Route path="vpn-configurations" element={<VpnConfigurations />} />
          <Route path="connection-logs" element={<ConnectionLogs />} />
          <Route path="system-logs" element={<SystemLogs />} />
          <Route path="user-subscriptions" element={<UserSubscriptions />} />
          <Route path="logs" element={<Logs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
```

- [ ] **Step 6: 运行测试验证**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
npm run dev
# 验证: http://localhost:5173/user-subscriptions 页面正常显示
```

- [ ] **Step 7: 提交代码**

```bash
cd /home/cheng/Project/vpn-service/admin-react-app
git add src/pages/UserSubscriptions.tsx src/App.tsx
git commit -m "feat: 添加用户订阅管理功能"
```

---

## 实现后端模块化开发计划总结

**已完成的模块：**
1. ✅ 用户管理模块
2. ✅ 节点管理模块
3. ✅ 订阅和订单管理模块
4. ✅ VPN配置管理
5. ✅ 连接日志管理
6. ✅ 系统日志管理
7. ✅ 用户订阅管理

**文件变更统计：**
- 后端新增文件: 15个
- 后端修改文件: 10个
- 前端新增文件: 7个
- 前端修改文件: 3个

**总计：35个文件的修改和创建**

---

**注意：** 本计划为简化版本，实际实现时需要根据项目具体情况调整。每个模块完成后请确保：
1. 后端服务正常运行
2. API接口测试通过
3. 前端页面正常显示
4. 增删改查功能正常工作
5. 代码已提交到git
6. 进行功能测试确保没有bug

**建议的工作流程：**
1. 按模块顺序逐一实现
2. 每完成一个模块后进行完整测试
3. 测试通过后提交代码
4. 记录每个模块的测试结果
5. 遇到问题及时解决并提交修复