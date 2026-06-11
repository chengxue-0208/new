import { Repository } from 'typeorm';
import { Node } from './node.entity';
export declare class NodesService {
    private nodeRepository;
    constructor(nodeRepository: Repository<Node>);
    create(nodeData: Partial<Node>): Promise<Node>;
    findAll(): Promise<Node[]>;
    findOne(id: string): Promise<Node>;
    update(id: string, nodeData: Partial<Node>): Promise<Node>;
    remove(id: string): Promise<void>;
    findByRegion(region: string): Promise<Node[]>;
    checkHealth(): Promise<any>;
}
