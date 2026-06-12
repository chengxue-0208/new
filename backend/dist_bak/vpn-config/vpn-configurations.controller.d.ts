import { VPNConfigurationsService } from './vpn-configurations.service';
export declare class VPNConfigurationsController {
    private readonly vpnConfigurationsService;
    constructor(vpnConfigurationsService: VPNConfigurationsService);
    findAll(): Promise<import("./vpn-config.entity").VPNConfiguration[]>;
    findOne(id: string): Promise<import("./vpn-config.entity").VPNConfiguration>;
    findByNodeId(nodeId: string): Promise<import("./vpn-config.entity").VPNConfiguration[]>;
    findByProtocol(protocol: 'tcp' | 'udp'): Promise<import("./vpn-config.entity").VPNConfiguration[]>;
    create(configData: any): Promise<import("./vpn-config.entity").VPNConfiguration>;
    update(id: string, configData: Partial<any>): Promise<import("./vpn-config.entity").VPNConfiguration>;
    remove(id: string): Promise<void>;
}
