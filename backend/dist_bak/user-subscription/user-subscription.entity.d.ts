import { User } from '../user/user.entity';
import { SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    EXPIRED = "EXPIRED",
    PENDING = "PENDING"
}
export declare class UserSubscription {
    id: string;
    userId: string;
    subscriptionPlanId: string;
    status: SubscriptionStatus;
    startDate: Date;
    endDate?: Date;
    trafficUsed: number;
    trafficLimit: number;
    deviceCount: number;
    activeDeviceCount: number;
    features: any;
    totalCost: number;
    refundAmount: number;
    paymentDetails?: any;
    activatedAt?: Date;
    deactivatedAt?: Date;
    cancelledAt?: Date;
    cancelReason?: string;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    subscriptionPlan: SubscriptionPlan;
}
export { User, SubscriptionPlan };
