import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, User, OrderStatus, OrderPaymentMethod } from '../order/order.entity';

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
      orderId: 'order-' + Date.now(),
      subscriptionPlanId: purchaseData.planId,
      planName: purchaseData.planName || '',
      plan: purchaseData.plan || null,
      amount: purchaseData.amount,
      paymentMethod: OrderPaymentMethod.WALLET,
      paymentTransactionId: purchaseData.paymentTransactionId || '',
      payUrl: purchaseData.payUrl || '',
      status: OrderStatus.PENDING,
      discountAmount: 0,
      refundAmount: 0,
      pointsUsed: 0,
      pointsEarned: 0,
    });

    return this.orderRepository.save(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await this.orderRepository.update(id, { status });
    return this.findOne(id);
  }
}