import { UserSubscriptionsService } from './user-subscriptions.service';
export declare class UserSubscriptionsController {
    private readonly userSubscriptionsService;
    constructor(userSubscriptionsService: UserSubscriptionsService);
    findAll(): Promise<import("./user-subscription.entity").UserSubscription[]>;
    findByUser(userId: string): Promise<import("./user-subscription.entity").UserSubscription[]>;
    findActive(): Promise<import("./user-subscription.entity").UserSubscription[]>;
    findExpired(): Promise<import("./user-subscription.entity").UserSubscription[]>;
    findByStatus(status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'): Promise<import("./user-subscription.entity").UserSubscription[]>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        expired: number;
    }>;
    create(subscriptionData: any): Promise<import("./user-subscription.entity").UserSubscription>;
    update(id: string, subscriptionData: Partial<any>): Promise<import("./user-subscription.entity").UserSubscription>;
    remove(id: string): Promise<void>;
}
