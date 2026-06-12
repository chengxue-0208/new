import { Repository } from 'typeorm';
import { Node } from './node.entity';
export declare class DelayService {
    private nodeRepository;
    private readonly logger;
    constructor(nodeRepository: Repository<Node>);
    checkNodeDelay(nodeId: string): Promise<number>;
    checkAllNodesDelay(): Promise<any[]>;
    updateNodeDelay(nodeId: string): Promise<number>;
    getDelayStats(): Promise<{
        total: number;
        online: number;
        offline: number;
        avgDelay: number;
    }>;
}
