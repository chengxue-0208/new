import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
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

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'subscriptionPlan', 'subscription'],
      order: {
        createdAt: 'DESC',
      }
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'subscriptionPlan', 'subscription'],
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
      where: { status },
      relations: ['user', 'subscriptionPlan'],
      order: { createdAt: 'DESC' }
    });
  }
}