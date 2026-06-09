import { SubscriptionService } from './subscription.service';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getPlans(): Promise<import("../entities").SubscriptionPlan[]>;
    getMySubscription(req: any): Promise<any>;
    purchase(purchaseData: any, req: any): Promise<any>;
}
