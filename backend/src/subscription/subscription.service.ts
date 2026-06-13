import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
  ) {}

  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.planRepository.find({
      order: {
        name: 'ASC',
        price: 'ASC',
      }
    });
  }

  async createPlan(planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const plan = this.planRepository.create(planData);
    return this.planRepository.save(plan);
  }

  async updatePlan(id: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    await this.planRepository.update(id, planData);
    return this.planRepository.findOne({ where: { id } });
  }

  async deletePlan(id: string): Promise<void> {
    await this.planRepository.delete(id);
  }

  async getMySubscription(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

   return {
      subscriptionStatus: user?.subscriptionStatus || 'EXPIRED',
      subscriptionExpiresAt: user?.subscriptionExpiresAt,
      trafficUsed: user?.trafficUsed || 0,
      trafficLimit: user?.trafficLimit || 0n,
    };
  }

  async purchase(purchaseData: any, userId: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const plan = await this.planRepository.findOne({
       where: { id: purchaseData.planId },
     });

    if (!plan) {
      throw new Error('Plan not found');
    }

    const newSubscription = {
      userId,
      planId: plan.id,
      startAt: new Date(),
      endAt: new Date(
        Date.now() + plan.durationDays * 24 * 60 * 60 * 1000,
      ),
      trafficLimit: plan.trafficLimit,
    };

    await this.userRepository.update(userId, {
      subscriptionPlanId: plan.id,
      subscriptionExpiresAt: newSubscription.endAt,
      subscriptionStatus: 'ACTIVE',
    });

    return newSubscription;
  }
}