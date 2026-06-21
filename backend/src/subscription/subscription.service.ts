import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
import { Node } from '../node/node.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
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
