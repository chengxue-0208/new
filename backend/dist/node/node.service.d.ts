import { Repository } from 'typeorm';
import { Node } from '../entities/node.entity';
export declare class NodeService {
    private nodeRepository;
    constructor(nodeRepository: Repository<Node>);
    findAll(): Promise<Node[]>;
    findOne(id: string): Promise<Node>;
    create(nodeData: Node): Promise<Node>;
    update(id: string, nodeData: any): Promise<Node>;
    remove(id: string): Promise<void>;
}
