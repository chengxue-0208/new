import { User } from './user.entity';
import { Node } from './node.entity';
export declare class VpnConfiguration {
    id: string;
    userId: string;
    nodeId: string;
    protocol: string;
    address: string;
    port: number;
    path: string;
    serverName: string;
    createdAt: Date;
    updatedAt: Date;
    user: User | null;
    node: Node | null;
}
