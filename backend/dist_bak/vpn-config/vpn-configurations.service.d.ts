import { Repository } from 'typeorm';
import { VPNConfiguration } from './vpn-config.entity';
import { Node } from '../node/node.entity';
export declare class VPNConfigurationsService {
    private configRepository;
    private nodeRepository;
    constructor(configRepository: Repository<VPNConfiguration>, nodeRepository: Repository<Node>);
    create(configData: Partial<VPNConfiguration>): Promise<VPNConfiguration>;
    findAll(): Promise<VPNConfiguration[]>;
    findOne(id: string): Promise<VPNConfiguration>;
    update(id: string, configData: Partial<VPNConfiguration>): Promise<VPNConfiguration>;
    remove(id: string): Promise<void>;
    findByNodeId(nodeId: string): Promise<VPNConfiguration[]>;
    findByProtocol(protocol: 'tcp' | 'udp'): Promise<VPNConfiguration[]>;
}
