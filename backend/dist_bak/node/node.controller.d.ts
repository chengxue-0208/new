import { NodesService } from './node.service';
export declare class NodesController {
    private readonly nodesService;
    constructor(nodesService: NodesService);
    findAll(): Promise<import("./node.entity").Node[]>;
    findOne(id: string): Promise<import("./node.entity").Node>;
    findByRegion(region: string): Promise<import("./node.entity").Node[]>;
    checkHealth(): Promise<any>;
    create(nodeData: any): Promise<import("./node.entity").Node>;
    update(id: string, nodeData: Partial<any>): Promise<import("./node.entity").Node>;
    remove(id: string): Promise<void>;
}
