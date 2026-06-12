import { Repository } from 'typeorm';
import { SystemLog, LogSource, LogLevel } from './system-log.entity';
export declare class SystemLogsService {
    private logRepository;
    constructor(logRepository: Repository<SystemLog>);
    create(logData: Partial<SystemLog>): Promise<SystemLog>;
    findAll(query: any): Promise<{
        data: SystemLog[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<SystemLog>;
    findByUser(userId: string): Promise<SystemLog[]>;
    findByLevel(level: LogLevel): Promise<SystemLog[]>;
    findBySource(source: LogSource): Promise<SystemLog[]>;
    search(message: string): Promise<SystemLog[]>;
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
