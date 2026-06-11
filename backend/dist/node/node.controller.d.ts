import { NodesService } from './nodes.service';
export declare class NodesController {
    private readonly nodesService;
    constructor(nodesService: NodesService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    findByRegion(region: string): Promise<any>;
    checkHealth(): Promise<any>;
    create(nodeData: any): Promise<any>;
    update(id: string, nodeData: Partial<any>): Promise<any>;
    remove(id: string): Promise<any>;
}
