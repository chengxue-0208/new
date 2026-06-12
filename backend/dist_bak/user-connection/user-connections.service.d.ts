import { Repository } from 'typeorm';
import { UserConnection } from '../user/user-connection.entity';
export declare class UserConnectionsService {
    private connectionRepository;
    constructor(connectionRepository: Repository<UserConnection>);
    create(connectionData: Partial<UserConnection>): Promise<UserConnection>;
    findAll(): Promise<UserConnection[]>;
    findOne(id: string): Promise<UserConnection>;
    update(id: string, connectionData: Partial<UserConnection>): Promise<UserConnection>;
    remove(id: string): Promise<void>;
    findByUser(userId: string): Promise<UserConnection[]>;
    findByNode(nodeId: string): Promise<UserConnection[]>;
    findActive(): Promise<UserConnection[]>;
    findDisconnected(): Promise<UserConnection[]>;
    clearOldConnections(): Promise<any>;
}
