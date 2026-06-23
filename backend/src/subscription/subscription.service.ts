import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
import { UserSubscription, SubscriptionStatus } from '../user-subscription/user-subscription.entity';
import { Node } from '../node/node.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(UserSubscription)
    private subscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
  ) {}

  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.planRepository.find({
      order: {
        name: 'ASC',
        price: 'ASC',
      }
    });
  }

  async getSubscribeText(): Promise<string> {
    const nodes = await this.nodeRepository.find({
      where: { status: 'online' },
      order: {
        region: 'ASC',
        name: 'ASC',
      },
    });

    return nodes.map((node) => this.formatNodeSubscribeLine(node)).join('\n');
  }

  private formatNodeSubscribeLine(node: Node): string {
    const queryFields: Array<keyof Pick<Node, 'encryption' | 'security' | 'sni' | 'fp' | 'type' | 'host' | 'path'>> = [
      'encryption',
      'security',
      'sni',
      'fp',
      'type',
      'host',
      'path',
    ];

    const query = queryFields
      .map((field) => {
        const value = node[field];
        return value === undefined || value === null || value === '' ? null : `${field}=${value}`;
      })
      .filter((item): item is string => item !== null)
      .join('&');

    const base = `${node.protocol}://${node.uuid}@${node.address}:${node.port}`;
    const fragment = node.name ? `#${encodeURIComponent(node.name)}` : '';

    return `${base}${query ? `?${query}` : ''}${fragment}`;
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

    if (!user) {
      return {
        subscriptionStatus: 'EXPIRED',
        subscriptionExpiresAt: null,
        trafficUsed: 0,
        trafficLimit: 0,
      };
    }

    const now = new Date();
    const expiresAt = user.subscriptionExpiresAt;
    const isExpired = user.subscriptionStatus === 'ACTIVE' && expiresAt && expiresAt <= now;

    return {
      subscriptionStatus: isExpired ? 'EXPIRED' : user.subscriptionStatus,
      subscriptionExpiresAt: expiresAt,
      trafficUsed: Number(user.trafficUsed || 0),
      trafficLimit: Number(user.trafficLimit || 0),
    };
  }

  async purchase(purchaseData: any, userId: string): Promise<any> {
    return this.activatePlanForUser(userId, purchaseData.planId, {
      source: 'subscription.purchase',
    });
  }

  async activatePlanForUser(userId: string, planId: string, metadata: Record<string, any> = {}): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const plan = await this.planRepository.findOne({
       where: { id: planId },
     });

    if (!plan) {
      throw new Error('Plan not found');
    }

    const now = new Date();
    const currentExpiresAt = user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : null;
    const renewalBase = user.subscriptionStatus === 'ACTIVE' && currentExpiresAt && currentExpiresAt > now
      ? currentExpiresAt
      : now;
    const endAt = this.calculateSubscriptionEndDate(renewalBase, plan.durationDays);

    await this.subscriptionRepository.update(
      { userId, status: SubscriptionStatus.ACTIVE },
      {
        status: SubscriptionStatus.INACTIVE,
        deactivatedAt: now,
      },
    );

    const subscription = this.subscriptionRepository.create({
      userId,
      subscriptionPlanId: plan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: now,
      endDate: endAt,
      trafficUsed: 0,
      trafficLimit: plan.trafficLimit,
      totalCost: plan.price,
      activatedAt: now,
      metadata: {
        ...metadata,
        previousExpiresAt: currentExpiresAt,
      },
    });

    const savedSubscription = await this.subscriptionRepository.save(subscription);

    const newSubscription = {
      id: savedSubscription.id,
      userId,
      planId: plan.id,
      startAt: now,
      endAt,
      trafficLimit: plan.trafficLimit,
      status: SubscriptionStatus.ACTIVE,
    };

    await this.userRepository.update(userId, {
      subscriptionPlanId: plan.id,
      subscriptionExpiresAt: endAt,
      subscriptionStatus: 'ACTIVE',
      trafficUsed: 0,
      trafficLimit: plan.trafficLimit,
    });

    return newSubscription;
  }

  private calculateSubscriptionEndDate(baseDate: Date, durationDays: number): Date | null {
    if (!durationDays || durationDays <= 0) {
      return null;
    }

    return new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
  }
}
