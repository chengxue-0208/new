import { User } from './user.entity';
import { Node } from './node.entity';
export declare class ConnectionLog {
    id: string;
    userId: string;
    nodeId: string;
    connectAt: Date;
    disconnectAt: Date;
    duration: number;
    traffic: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user: User | null;
    node: Node | null;
}
