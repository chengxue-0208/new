import { VPNConfiguration } from '../vpn/vpn-configuration.entity';
import { UserConnection } from '../user/user-connection.entity';
import { Region } from './region.entity';
export declare class Node {
    id: string;
    name: string;
    region: string;
    ipAddress: string;
    port?: number;
    serverAddress?: string;
    serverPort?: number;
    status: 'online' | 'offline' | 'maintenance';
    statusMessage?: string;
    uptime: number;
    maxConnections: number;
    currentConnections: number;
    delay: number;
    path?: string;
    load: number;
    bandwidth: number;
    regionEntity: Region;
    configs: VPNConfiguration[];
    connections: UserConnection[];
    createdAt: Date;
    updatedAt: Date;
}
