import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';

@Injectable()
export class SubscriptionPlanService {
  private readonly logger = new Logger(SubscriptionPlanService.name);

  constructor(
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
  ) {}

  async findAll() {
    const plans = await this.planRepository.find({
      order: { displayOrder: 'ASC' },
    });

    return plans;
  }

  async findOne(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });

    if (!plan) {
      throw new Error('Subscription plan not found');
    }

    return plan;
  }

  async create(planData: Partial<SubscriptionPlan>) {
    const plan = this.planRepository.create(planData);
    return this.planRepository.save(plan);
  }

  async update(id: string, planData: Partial<SubscriptionPlan>) {
    await this.planRepository.update(id, planData);
    return this.planRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.planRepository.delete(id);
    return { message: 'Subscription plan deleted successfully' };
  }

  async toggleStatus(id: string) {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new Error('Subscription plan not found');
    }
    plan.status = plan.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await this.planRepository.save(plan);
    return plan;
  }
}