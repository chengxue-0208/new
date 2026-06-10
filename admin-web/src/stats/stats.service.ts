import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Node, Order, SubscriptionPlan, ConnectionLog, SystemLog } from '../entities';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

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

  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalNodes,
      onlineNodes,
      totalOrders,
      successfulOrders,
      failedOrders,
      cancelledOrders,
      revenue,
      totalPlans,
      totalTrafficUsed,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { subscriptionStatus: 'ACTIVE' } }),
      this.nodeRepository.count(),
      this.nodeRepository.count({ where: { status: 'online' } }),
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: 'PAID' } }),
      this.orderRepository.count({ where: { status: 'FAILED' } }),
      this.orderRepository.count({ where: { status: 'CANCELLED' } }),
      this.orderRepository.sum('amount'),
      this.planRepository.count(),
      this.userRepository.sum('trafficUsed'),
    ]);

    const recentOrders = await this.orderRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const recentLogs = await this.systemLogRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      totalUsers,
      activeUsers,
      totalNodes,
      onlineNodes,
      totalOrders,
      successfulOrders,
      failedOrders,
      cancelledOrders,
      revenue: Number(revenue) || 0,
      totalPlans,
      totalTrafficUsed: Number(totalTrafficUsed) || 0,
      recentOrders,
      recentLogs,
    };
  }

  async getUserGrowthChartData(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await this.userRepository
      .createQueryBuilder('user')
      .select('COUNT(*) as total', "DATE_TRUNC('day', createdAt) as date")
      .where('createdAt >= :startDate', { startDate })
      .groupBy("DATE_TRUNC('day', createdAt)")
      .orderBy("DATE_TRUNC('day', createdAt)", 'ASC')
      .getRawMany();

    return results;
  }

  async getRevenueChartData(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(amount) as total', "DATE_TRUNC('day', createdAt) as date")
      .where('createdAt >= :startDate', { startDate })
      .andWhere('status = :status', { status: 'PAID' })
      .groupBy("DATE_TRUNC('day', createdAt)")
      .orderBy("DATE_TRUNC('day', createdAt)", 'ASC')
      .getRawMany();

    return results;
  }

  async getNodeStats() {
    const [totalNodes, onlineNodes, offlineNodes] = await Promise.all([
      this.nodeRepository.count(),
      this.nodeRepository.count({ where: { status: 'online' } }),
      this.nodeRepository.count({ where: { status: 'offline' } }),
    ]);

    return {
      totalNodes,
      onlineNodes,
      offlineNodes,
    };
  }

  async getTopUsers(limit: number = 10) {
    return this.userRepository.find({
      order: { trafficUsed: 'DESC' },
      take: limit,
    });
  }

  async getRecentOrders(limit: number = 20) {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}