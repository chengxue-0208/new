import { Repository } from 'typeorm';
import { User, Node, VpnConfiguration, ConnectionLog } from '../entities';
export declare class VpnService {
    private userRepository;
    private nodeRepository;
    private vpnConfigRepository;
    private connectionLogRepository;
    constructor(userRepository: Repository<User>, nodeRepository: Repository<Node>, vpnConfigRepository: Repository<VpnConfiguration>, connectionLogRepository: Repository<ConnectionLog>);
    connect(userId: string, connectionData: any): Promise<any>;
    disconnect(userId: string): Promise<any>;
    getStatus(userId: string): Promise<any>;
    getConfig(userId: string): Promise<any>;
}
