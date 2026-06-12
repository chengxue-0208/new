import { SystemLogsService } from './system-logs.service';
import { LogLevel, LogSource } from './system-log.entity';
export declare class SystemLogsController {
    private readonly systemLogsService;
    constructor(systemLogsService: SystemLogsService);
    findAll(query: any): Promise<{
        data: import("./system-log.entity").SystemLog[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByUser(userId: string): Promise<import("./system-log.entity").SystemLog[]>;
    findByLevel(level: LogLevel): Promise<import("./system-log.entity").SystemLog[]>;
    findBySource(source: LogSource): Promise<import("./system-log.entity").SystemLog[]>;
    search(message: string): Promise<import("./system-log.entity").SystemLog[]>;
    getStats(): Promise<{
        total: number;
        error: number;
        warning: number;
        info: number;
        debug: number;
    }>;
    clearOldLogs(): Promise<{
        message: string;
    }>;
}
