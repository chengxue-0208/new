import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
  ) {}

  async create(planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const plan = this.planRepository.create(planData);
    return this.planRepository.save(plan);
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    return this.planRepository.find({
      order: {
        name: 'ASC',
        price: 'ASC',
      }
    });
  }

  async findOne(id: string): Promise<SubscriptionPlan> {
    const plan = await this.planRepository.findOne({
      where: { id },
    });
    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }
    return plan;
  }

  async update(id: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    await this.planRepository.update(id, planData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.planRepository.delete(id);
  }
}