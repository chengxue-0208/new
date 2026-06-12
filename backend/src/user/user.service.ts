import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
import { Order } from '../order/order.entity';

@Injectable()
export class UserService {
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