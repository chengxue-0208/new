import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Order, OrderStatus } from '../order/order.entity';
import { Node } from '../node/node.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Node)
    private readonly nodeRepository: Repository<Node>,
  ) {}

  async getStats() {
    const [totalUsers, totalOrders, totalNodes, activeUsers, paidOrders] = await Promise.all([
      this.userRepository.count(),
      this.orderRepository.count(),
      this.nodeRepository.count(),
      this.userRepository.count({ where: { status: 'active' } }),
      this.orderRepository.count({ where: { status: OrderStatus.PAID } }),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalNodes,
      activeUsers,
      paidOrders,
    };
  }
}
