import { User } from './user.entity';
import { VpnConfiguration } from './vpn-config.entity';
export declare class Node {
    id: string;
    name: string;
    region: string;
    protocol: string;
    address: string;
    port: number;
    path: string;
    serverName: string;
    delay: number;
    status: string;
    isFree: boolean;
    user: User | null;
    configurations: VpnConfiguration[];
    createdAt: Date;
    updatedAt: Date;
}
