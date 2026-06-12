"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const system_log_entity_1 = require("./system-log.entity");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("typeorm");
let SystemLogsService = class SystemLogsService {
    constructor(logRepository) {
        this.logRepository = logRepository;
    }
    async create(logData) {
        const log = this.logRepository.create(logData);
        return this.logRepository.save(log);
    }
    async findAll(query) {
        const { page = 1, limit = 10, level, source, startDate, endDate } = query;
        const queryBuilder = this.logRepository.createQueryBuilder('log')
            .leftJoinAndSelect('log.metadata', 'metadata');
        if (level) {
            queryBuilder.andWhere('log.level = :level', { level });
        }
        if (source) {
            queryBuilder.andWhere('log.source = :source', { source });
        }
        if (startDate || endDate) {
            queryBuilder.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
                startDate: startDate || new Date(0).toISOString(),
                endDate: endDate || new Date().toISOString(),
            });
        }
        const [data, total] = await queryBuilder
            .orderBy('log.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
        };
    }
    async findOne(id) {
        const log = await this.logRepository.findOne({
            where: { id },
            relations: ['metadata'],
        });
        if (!log) {
            throw new common_1.NotFoundException('System log not found');
        }
        return log;
    }
    async findByUser(userId) {
        return this.logRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findByLevel(level) {
        return this.logRepository.find({
            where: { level },
            order: { createdAt: 'DESC' },
        });
    }
    async findBySource(source) {
        return this.logRepository.find({
            where: { source },
            order: { createdAt: 'DESC' },
        });
    }
    async search(message) {
        return this.logRepository.find({
            where: { message: (0, typeorm_4.Like)(`%${message}%`) },
            order: { createdAt: 'DESC' },
        });
    }
    async getStats() {
        const total = await this.logRepository.count();
        const error = await this.logRepository.count({ where: { level: system_log_entity_1.LogLevel.ERROR } });
        const warning = await this.logRepository.count({ where: { level: system_log_entity_1.LogLevel.WARNING } });
        const info = await this.logRepository.count({ where: { level: system_log_entity_1.LogLevel.INFO } });
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
            createdAt: (0, typeorm_3.LessThan)(cutoffDate),
        });
        return { message: 'Old logs cleared' };
    }
};
exports.SystemLogsService = SystemLogsService;
exports.SystemLogsService = SystemLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(system_log_entity_1.SystemLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SystemLogsService);
//# sourceMappingURL=system-logs.service.js.map