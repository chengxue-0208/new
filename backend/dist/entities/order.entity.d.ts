import { User } from './user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
export declare class Order {
    id: string;
    userId: string;
    planId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    payUrl: string;
    paymentTransactionId: string;
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
    user: User | null;
    plan: SubscriptionPlan | null;
}
