export declare class ConnectionLog {
    id: string;
    userId: string;
    nodeId: string;
    connectAt: Date;
    disconnectAt?: Date;
    ip?: string;
    protocol?: string;
    duration?: number;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
}
