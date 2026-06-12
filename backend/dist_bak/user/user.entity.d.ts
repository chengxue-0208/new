import { Node } from '../node/node.entity';
import { VPNConfiguration } from '../vpn/vpn-configuration.entity';
import { Order } from '../order/order.entity';
import { UserSubscription } from '../user-subscription/user-subscription.entity';
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
    connections: VPNConfiguration[];
    orders: Order[];
    subscriptions: UserSubscription[];
}
import { ConnectionLog } from '../connection-log/connection-log.entity';
export { Node, VPNConfiguration, ConnectionLog };
