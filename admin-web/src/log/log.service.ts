import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessThan } from 'typeorm';
import { SystemLog, ConnectionLog } from '../entities';

@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name);

  constructor(
    @InjectRepository(SystemLog)
    private systemLogRepository: Repository<SystemLog>,
    @InjectRepository(ConnectionLog)
    private connectionLogRepository: Repository<ConnectionLog>,
  ) {}

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.systemLogRepository.find({
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      }),
      this.systemLogRepository.count(),
    ]);

    return {
      logs,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const log = await this.systemLogRepository.findOne({ where: { id } });

    if (!log) {
      throw new Error('Log not found');
    }

    return log;
  }

  async remove(id: string) {
    await this.systemLogRepository.delete(id);
    return { message: 'Log deleted successfully' };
  }

  async clearOldLogs(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.systemLogRepository.delete({
      createdAt: LessThan(cutoffDate),
    });

    return {
      message: `Cleared ${result.affected || 0} old logs`,
      deletedCount: result.affected || 0,
    };
  }

  async getErrorLogs(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.systemLogRepository.find({
        where: { level: 'ERROR' },
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      }),
      this.systemLogRepository.count({ where: { level: 'ERROR' } }),
    ]);

    return {
      logs,
      total,
      page,
      limit,
    };
  }

  async getConnectionLogs(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.connectionLogRepository.find({
        order: { connectAt: 'DESC' },
        skip,
        take: limit,
      }),
      this.connectionLogRepository.count(),
    ]);

    return {
      logs,
      total,
      page,
      limit,
    };
  }
}