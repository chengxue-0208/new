import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSubscription } from './user-subscription.entity';
import { LessThan } from 'typeorm';
import { SubscriptionStatus } from './user-subscription.entity';

@Injectable()
export class UserSubscriptionsService {
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
      relations: ['user', 'subscriptionPlan'],
      order: {
        createdAt: 'DESC',
      }
    });
  }

  async findOne(id: string): Promise<UserSubscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'subscriptionPlan'],
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

  async findByUser(userId: string): Promise<UserSubscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      relations: ['subscriptionPlan'],
      order: { createdAt: 'DESC' }
    });
  }

  async findActive(): Promise<UserSubscription[]> {
    return this.subscriptionRepository.find({
      where: { status: SubscriptionStatus.ACTIVE },
      relations: ['user', 'subscriptionPlan'],
      order: { endDate: 'DESC' }
    });
  }

  async findExpired(): Promise<UserSubscription[]> {
    const today = new Date();
    return this.subscriptionRepository.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: LessThan(today),
      },
      relations: ['user', 'subscriptionPlan'],
      order: { endDate: 'ASC' }
    });
  }

  async findByStatus(status: SubscriptionStatus): Promise<UserSubscription[]> {
    return this.subscriptionRepository.find({
      where: { status },
      relations: ['user', 'subscriptionPlan'],
      order: { createdAt: 'DESC' }
    });
  }

 async getStats() {
    const total = await this.subscriptionRepository.count();
    const active = await this.subscriptionRepository.count({ where: { status: SubscriptionStatus.ACTIVE } });
    const inactive = await this.subscriptionRepository.count({ where: { status: SubscriptionStatus.INACTIVE } });
    const expired = await this.subscriptionRepository.count({ where: { status: SubscriptionStatus.EXPIRED } });

    return {
      total,
      active,
      inactive,
      expired,
    };
  }
}