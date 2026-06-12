import { Repository } from 'typeorm';
import { UserSubscription } from './user-subscription.entity';
import { SubscriptionStatus } from './user-subscription.entity';
export declare class UserSubscriptionsService {
    private subscriptionRepository;
    constructor(subscriptionRepository: Repository<UserSubscription>);
    create(subscriptionData: Partial<UserSubscription>): Promise<UserSubscription>;
    findAll(): Promise<UserSubscription[]>;
    findOne(id: string): Promise<UserSubscription>;
    update(id: string, subscriptionData: Partial<UserSubscription>): Promise<UserSubscription>;
    remove(id: string): Promise<void>;
    findByUser(userId: string): Promise<UserSubscription[]>;
    findActive(): Promise<UserSubscription[]>;
    findExpired(): Promise<UserSubscription[]>;
    findByStatus(status: SubscriptionStatus): Promise<UserSubscription[]>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        expired: number;
    }>;
}
