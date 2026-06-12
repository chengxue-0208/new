import { UserConnectionsService } from './user-connections.service';
export declare class UserConnectionsController {
    private readonly userConnectionsService;
    constructor(userConnectionsService: UserConnectionsService);
    findAll(): Promise<import("../entities").UserConnection[]>;
    findByUser(userId: string): Promise<import("../entities").UserConnection[]>;
    findByNode(nodeId: string): Promise<import("../entities").UserConnection[]>;
    findActive(): Promise<import("../entities").UserConnection[]>;
    findDisconnected(): Promise<import("../entities").UserConnection[]>;
    clearOldConnections(): Promise<any>;
    remove(id: string): Promise<void>;
}
