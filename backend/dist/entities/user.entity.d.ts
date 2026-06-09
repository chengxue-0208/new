import { Node } from './node.entity';
import { VpnConfiguration } from './vpn-config.entity';
import { Order } from './order.entity';
import { UserSubscription } from './user-subscription.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    balance: number;
    subscriptionStatus: string;
    subscriptionPlanId: string;
    subscriptionExpiresAt: Date;
    trafficUsed: number;
    trafficLimit: number;
    createdAt: Date;
    updatedAt: Date;
    nodes: Node[];
    connections: VpnConfiguration[];
    orders: Order[];
    subscriptions: UserSubscription[];
}
