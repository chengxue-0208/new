import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemLog, LogSource, LogLevel } from './system-log.entity';
import { LessThan } from 'typeorm';
import { Like } from 'typeorm';

@Injectable()
export class SystemLogsService {
  constructor(
    @InjectRepository(SystemLog)
    private logRepository: Repository<SystemLog>,
  ) {}

  async create(logData: Partial<SystemLog>): Promise<SystemLog> {
    const log = this.logRepository.create(logData);
    return this.logRepository.save(log);
  }

  async findAll(query: any) {
    const {
      page = 1,
      limit = 10,
    } = query;
    const level = this.normalizeQueryValue(query.level);
    const source = this.normalizeQueryValue(query.source);
    const search = this.normalizeQueryValue(query.search);
    const from = this.normalizeDateValue(query.startDate) || this.normalizeDateValue(query.dateFrom);
    const to = this.normalizeDateValue(query.endDate) || this.normalizeDateValue(query.dateTo);
    const pageNumber = this.normalizePositiveInteger(page, 1);
    const limitNumber = this.normalizePositiveInteger(limit, 10);

    const queryBuilder = this.logRepository.createQueryBuilder('log');

    if (level) {
      queryBuilder.andWhere('log.level = :level', { level: level.toUpperCase() });
    }

    if (source) {
      queryBuilder.andWhere('log.source = :source', { source });
    }

    if (search) {
      queryBuilder.andWhere('log.message ILIKE :search', { search: `%${search}%` });
    }

    if (from || to) {
      queryBuilder.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate: from || new Date(0).toISOString(),
        endDate: to || new Date().toISOString(),
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('log.createdAt', 'DESC')
      .skip((pageNumber - 1) * limitNumber)
      .take(limitNumber)
      .getManyAndCount();

    const mappedData = data.map((item) => ({
      id: item.id,
      level: item.level.toLowerCase(),
      message: item.message,
      ip: item.ipAddress || '-',
      timestamp: item.createdAt,
      source: item.source,
      userId: item.userId,
      nodeId: item.nodeId,
      responseTime: item.responseTime,
    }));

    return {
      data: mappedData,
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  private normalizeQueryValue(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    const normalized = String(value).trim();
    const lowerValue = normalized.toLowerCase();
    if (!normalized || lowerValue === 'undefined' || lowerValue === 'null' || lowerValue === 'all') {
      return undefined;
    }

    return normalized;
  }

  private normalizeDateValue(value: unknown): string | undefined {
    const normalized = this.normalizeQueryValue(value);
    if (!normalized) {
      return undefined;
    }

    const timestamp = Date.parse(normalized);
    return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString();
  }

  private normalizePositiveInteger(value: unknown, fallback: number): number {
    const numberValue = Number(value);
    return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : fallback;
  }

  async findOne(id: string): Promise<SystemLog> {
    const log = await this.logRepository.findOne({
      where: { id },
      relations: ['metadata'],
    });
    if (!log) {
      throw new NotFoundException('System log not found');
    }
    return log;
  }

  async findByUser(userId: string) {
    return this.logRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByLevel(level: LogLevel) {
    return this.logRepository.find({
      where: { level },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySource(source: LogSource) {
    return this.logRepository.find({
      where: { source },
      order: { createdAt: 'DESC' },
    });
  }

  async search(message: string) {
    return this.logRepository.find({
      where: { message: Like(`%${message}%`) },
      order: { createdAt: 'DESC' },
    });
  }

  async getStats() {
    const total = await this.logRepository.count();
    const error = await this.logRepository.count({ where: { level: LogLevel.ERROR } });
    const warning = await this.logRepository.count({ where: { level: LogLevel.WARNING } });
    const info = await this.logRepository.count({ where: { level: LogLevel.INFO } });

    return {
      total,
      error,
      warning,
      info,
      debug: total - error - warning - info,
    };
  }

  async clearOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    await this.logRepository.delete({
      createdAt: LessThan(cutoffDate),
    });
    return { message: 'Old logs cleared' };
  }
}
