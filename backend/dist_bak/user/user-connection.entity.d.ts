import { User } from './user.entity';
import { Node } from '../node/node.entity';
import { VPNConfiguration } from '../vpn/vpn-configuration.entity';
export declare class UserConnection {
    id: string;
    userId: string;
    nodeId: string;
    ipAddress: string;
    vpnIp?: string;
    vpnPort?: number;
    status: 'active' | 'disconnected' | 'error' | 'pending';
    errorMessage?: string;
    disconnectReason?: string;
    reconnectCount: number;
    bandwidthIn: number;
    bandwidthOut: number;
    connectionDuration: number;
    disconnectTime?: Date;
    protocol: 'tcp' | 'udp';
    user: User;
    node: Node;
    config?: VPNConfiguration;
    createdAt: Date;
    updatedAt: Date;
}
