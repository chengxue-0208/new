import { User } from '../user/user.entity';
import { SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
import { SubscriptionStatus } from '../user-subscription/user-subscription.entity';
export { User };
export { SubscriptionPlan };
export { SubscriptionStatus };
export declare enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export declare enum OrderPaymentMethod {
    WALLET = "WALLET",
    CREDIT_CARD = "CREDIT_CARD",
    ALIPAY = "ALIPAY",
    WECHAT_PAY = "WECHAT_PAY",
    OTHER = "OTHER"
}
export declare class Order {
    id: string;
    userId: string;
    orderId: string;
    status: OrderStatus;
    subscriptionPlanId?: string;
    paymentMethod: OrderPaymentMethod;
    totalAmount: number;
    planName?: string;
    plan?: string;
    paidAmount?: number;
    discountAmount: number;
    refundAmount: number;
    pointsUsed: number;
    pointsEarned: number;
    user: User;
    subscriptionPlan: SubscriptionPlan;
    paymentTime?: Date;
    completedTime?: Date;
    refundTime?: Date;
    paidAt?: Date;
    paymentDetails?: any;
    transactionId?: string;
    transactionNote?: string;
    paymentTransactionId?: string;
    payUrl?: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}
