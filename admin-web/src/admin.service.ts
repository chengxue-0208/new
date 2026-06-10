import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Node, Order, SubscriptionPlan, ConnectionLog, SystemLog } from './entities';

export interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalNodes: number;
  onlineNodes: number;
  totalOrders: number;
  successfulOrders: number;
  totalRevenue: number;
  totalTrafficUsed: number;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(ConnectionLog)
    private connectionLogRepository: Repository<ConnectionLog>,
    @InjectRepository(SystemLog)
    private systemLogRepository: Repository<SystemLog>,
  ) {}

  async getStats(): Promise<Stats> {
    const [
      totalUsers,
      activeUsers,
      totalNodes,
      onlineNodes,
      totalOrders,
      successfulOrders,
      totalRevenue,
      totalTrafficUsed,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { subscriptionStatus: 'ACTIVE' } }),
      this.nodeRepository.count(),
      this.nodeRepository.count({ where: { status: 'online' } }),
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: 'PAID' } }),
      this.orderRepository.sum('amount'),
      this.userRepository.sum('trafficUsed'),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalNodes,
      onlineNodes,
      totalOrders,
      successfulOrders,
      totalRevenue: Number(totalRevenue) || 0,
      totalTrafficUsed: Number(totalTrafficUsed) || 0,
    };
  }

  async getUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userRepository.find({
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      }),
      this.userRepository.count(),
    ]);

    return {
      users,
      total,
      page,
      limit,
    };
  }

  async getUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getNodes() {
    const nodes = await this.nodeRepository.find({
      order: { name: 'ASC' },
    });

    return nodes;
  }

  async createNode(nodeData: Node) {
    const node = this.nodeRepository.create(nodeData);
    return this.nodeRepository.save(node);
  }

  async updateNode(id: string, nodeData: any) {
    await this.nodeRepository.update(id, nodeData);
    return this.nodeRepository.findOne({ where: { id } });
  }

  async deleteNode(id: string) {
    await this.nodeRepository.delete(id);
    return { message: 'Node deleted successfully' };
  }

  async getOrders(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.orderRepository.find({
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      }),
      this.orderRepository.count(),
    ]);

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  async getOrder(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async getLogs(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.systemLogRepository.find({
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      }),
      this.systemLogRepository.count(),
    ]);

    return {
      logs,
      total,
      page,
      limit,
    };
  }

  async deleteLog(id: string) {
    await this.systemLogRepository.delete(id);
    return { message: 'Log deleted successfully' };
  }

  async getSubscriptionPlans() {
    const plans = await this.planRepository.find({
      order: { displayOrder: 'ASC' },
    });

    return plans;
  }

  async createSubscriptionPlan(planData: SubscriptionPlan) {
    const plan = this.planRepository.create(planData);
    return this.planRepository.save(plan);
  }

  async updateSubscriptionPlan(id: string, planData: any) {
    await this.planRepository.update(id, planData);
    return this.planRepository.findOne({ where: { id } });
  }

  async deleteSubscriptionPlan(id: string) {
    await this.planRepository.delete(id);
    return { message: 'Subscription plan deleted successfully' };
  }

  async addSystemLog(level: string, message: string, error?: string, userId?: string, ipAddress?: string) {
    const log = this.systemLogRepository.create({
      level,
      message,
      errorCode: error,
      userId,
      ipAddress,
    });

    return this.systemLogRepository.save(log);
  }
}