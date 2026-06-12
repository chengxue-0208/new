import { DelayService } from './delay.service';
import { NodesService } from './node.service';
export declare class DelayController {
    private readonly delayService;
    private readonly nodeService;
    constructor(delayService: DelayService, nodeService: NodesService);
    checkAll(): Promise<{
        success: boolean;
        message: string;
        delays: any[];
        stats: {
            total: number;
            online: number;
            offline: number;
            avgDelay: number;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        delays?: undefined;
        stats?: undefined;
    }>;
    checkOne(nodeId: string): Promise<{
        success: boolean;
        nodeId: string;
        delay: number;
        message?: undefined;
    } | {
        success: boolean;
        nodeId: string;
        message: any;
        delay?: undefined;
    }>;
    updateAll(): Promise<{
        success: boolean;
        message: string;
        stats: {
            total: number;
            online: number;
            offline: number;
            avgDelay: number;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        stats?: undefined;
    }>;
    getStats(): Promise<{
        success: boolean;
        stats: {
            total: number;
            online: number;
            offline: number;
            avgDelay: number;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        stats?: undefined;
    }>;
}
