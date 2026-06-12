import { SubscriptionPlansService } from './subscription-plans.service';
export declare class SubscriptionPlansController {
    private readonly subscriptionPlansService;
    constructor(subscriptionPlansService: SubscriptionPlansService);
    findAll(): Promise<import("./subscription-plan.entity").SubscriptionPlan[]>;
    findOne(id: string): Promise<import("./subscription-plan.entity").SubscriptionPlan>;
    create(planData: any): Promise<import("./subscription-plan.entity").SubscriptionPlan>;
    update(id: string, planData: Partial<any>): Promise<import("./subscription-plan.entity").SubscriptionPlan>;
    remove(id: string): Promise<void>;
}
