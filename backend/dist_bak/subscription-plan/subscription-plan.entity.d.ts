export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    EXPIRED = "EXPIRED",
    PENDING = "PENDING"
}
export declare enum SubscriptionType {
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY",
    LIFETIME = "LIFETIME"
}
export declare class SubscriptionPlan {
    id: string;
    name: string;
    type: SubscriptionType;
    price: number;
    originalPrice?: number;
    durationDays: number;
    trafficLimit: number;
    maxDevices: number;
    description?: string;
    isActive: boolean;
    discountRate: number;
    refundRate: number;
    createdAt: Date;
    updatedAt: Date;
}
export * from '../user/user.entity';
export * from '../user-subscription/user-subscription.entity';
