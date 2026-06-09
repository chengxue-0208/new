import { User } from './user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
export declare class UserSubscription {
    id: string;
    userId: string;
    subscriptionPlanId: string;
    pricePaid: number;
    status: string;
    expiresAt: Date;
    trafficUsed: number;
    trafficLimit: number;
    createdAt: Date;
    updatedAt: Date;
    user: User | null;
    subscriptionPlan: SubscriptionPlan | null;
}
