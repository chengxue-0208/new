import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
  ) {}

  async create(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
    status?: string,
  ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.subscriptionPlan', 'subscriptionPlan')
      .orderBy('order.createdAt', 'DESC');

    if (status && status !== 'all') {
      query.andWhere('order.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(order.orderId ILIKE :search OR order.planName ILIKE :search OR user.username ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const pageNumber = page && page > 0 ? page : 1;
    const pageSize = limit && limit > 0 ? limit : 10;

    query.skip((pageNumber - 1) * pageSize).take(pageSize);

    const [data, total] = await query.getManyAndCount();
    return { data, total, page: pageNumber, limit: pageSize };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'subscriptionPlan'],
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

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['subscriptionPlan'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { status: status as OrderStatus },
      relations: ['user', 'subscriptionPlan'],
      order: { createdAt: 'DESC' }
    });
  }
}
