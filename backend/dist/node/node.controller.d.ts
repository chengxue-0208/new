import { NodeService } from './node.service';
export declare class NodeController {
    private readonly nodeService;
    constructor(nodeService: NodeService);
    findAll(): Promise<import("../entities").Node[]>;
    create(nodeData: any): Promise<import("../entities").Node>;
    findOne(id: string): Promise<import("../entities").Node>;
}
