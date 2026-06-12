import { Repository } from 'typeorm';
import { User, Node, VPNConfiguration } from '../user/user.entity';
import { ConnectionLog } from '../connection-log/connection-log.entity';
export declare class VpnService {
    private userRepository;
    private nodeRepository;
    private vpnConfigRepository;
    private connectionLogRepository;
    constructor(userRepository: Repository<User>, nodeRepository: Repository<Node>, vpnConfigRepository: Repository<VPNConfiguration>, connectionLogRepository: Repository<ConnectionLog>);
    connect(userId: string, connectionData: any): Promise<any>;
    disconnect(userId: string): Promise<any>;
    getStatus(userId: string): Promise<any>;
    getConfig(userId: string): Promise<any>;
}
