import { UserSubscription } from './user-subscription.entity';
export declare class SubscriptionPlan {
    id: string;
    name: string;
    durationDays: number;
    monthlyTraffic: number;
    price: number;
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
    subscriptions: UserSubscription[];
}
