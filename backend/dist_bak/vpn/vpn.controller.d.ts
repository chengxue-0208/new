import { VpnService } from './vpn.service';
export declare class VpnController {
    private readonly vpnService;
    constructor(vpnService: VpnService);
    connect(connectionData: any, userId: string): Promise<any>;
    disconnect(userId: string): Promise<any>;
    getStatus(userId: string): Promise<any>;
    getConfig(userId: string): Promise<any>;
}
