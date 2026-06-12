import { Repository } from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
export declare class SubscriptionPlansService {
    private planRepository;
    constructor(planRepository: Repository<SubscriptionPlan>);
    create(planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan>;
    findAll(): Promise<SubscriptionPlan[]>;
    findOne(id: string): Promise<SubscriptionPlan>;
    update(id: string, planData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan>;
    remove(id: string): Promise<void>;
}
