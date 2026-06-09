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

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async create(purchaseData: any, userId: string): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const order = this.orderRepository.create({
      userId,
      planId: purchaseData.planId,
      amount: purchaseData.amount,
      paymentMethod: purchaseData.paymentMethod,
      status: 'PENDING',
    });

    return this.orderRepository.save(order);
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    await this.orderRepository.update(id, { status });
    return this.findOne(id);
  }
}