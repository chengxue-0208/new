import { Node } from '../node/node.entity';
import { UserConnection } from '../user/user-connection.entity';
export declare class VPNConfiguration {
    id: string;
    name: string;
    nodeId: string;
    protocol: 'tcp' | 'udp';
    port: number;
    dns?: string;
    encryption?: string;
    compression?: string;
    bandwidth: number;
    maxConnections: number;
    currentConnections: number;
    isActive: boolean;
    statusMessage?: string;
    settings?: any;
    notes?: string;
    node: Node;
    connections: UserConnection[];
    createdAt: Date;
    updatedAt: Date;
}
