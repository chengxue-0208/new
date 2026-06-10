import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(page: number = 1, limit: number = 20) {
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

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async create(orderData: Partial<Order>) {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async update(id: string, orderData: Partial<Order>) {
    await this.orderRepository.update(id, orderData);
    return this.orderRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.orderRepository.delete(id);
    return { message: 'Order deleted successfully' };
  }

  async updateStatus(id: string, status: Order['status']) {
    await this.orderRepository.update(id, { status });
    return this.orderRepository.findOne({ where: { id } });
  }

  async getStats() {
    const [total, successful, failed, cancelled, revenue] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: 'PAID' } }),
      this.orderRepository.count({ where: { status: 'FAILED' } }),
      this.orderRepository.count({ where: { status: 'CANCELLED' } }),
      this.orderRepository.sum('amount'),
    ]);

    return {
      total,
      successful,
      failed,
      cancelled,
      revenue: Number(revenue) || 0,
    };
  }
}