import { Repository } from 'typeorm';
import { User, SubscriptionPlan } from '../entities';
export declare class SubscriptionService {
    private userRepository;
    private planRepository;
    constructor(userRepository: Repository<User>, planRepository: Repository<SubscriptionPlan>);
    getPlans(): Promise<SubscriptionPlan[]>;
    getMySubscription(userId: string): Promise<any>;
    purchase(purchaseData: any, userId: string): Promise<any>;
}
