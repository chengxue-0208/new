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
exports.UserConnectionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_connection_entity_1 = require("../user/user-connection.entity");
const typeorm_3 = require("typeorm");
let UserConnectionsService = class UserConnectionsService {
    constructor(connectionRepository) {
        this.connectionRepository = connectionRepository;
    }
    async create(connectionData) {
        const connection = this.connectionRepository.create(connectionData);
        return this.connectionRepository.save(connection);
    }
    async findAll() {
        return this.connectionRepository.find({
            relations: ['user', 'node'],
            order: {
                createdAt: 'DESC',
            }
        });
    }
    async findOne(id) {
        const connection = await this.connectionRepository.findOne({
            where: { id },
            relations: ['user', 'node'],
        });
        if (!connection) {
            throw new common_1.NotFoundException('Connection not found');
        }
        return connection;
    }
    async update(id, connectionData) {
        await this.connectionRepository.update(id, connectionData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.connectionRepository.delete(id);
    }
    async findByUser(userId) {
        return this.connectionRepository.find({
            where: { userId },
            relations: ['node'],
            order: { createdAt: 'DESC' }
        });
    }
    async findByNode(nodeId) {
        return this.connectionRepository.find({
            where: { nodeId },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
    async findActive() {
        return this.connectionRepository.find({
            where: { status: 'active' },
            relations: ['user', 'node'],
            order: { createdAt: 'DESC' }
        });
    }
    async findDisconnected() {
        return this.connectionRepository.find({
            where: { status: 'disconnected' },
            relations: ['user', 'node'],
            order: { updatedAt: 'DESC' }
        });
    }
    async clearOldConnections() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        await this.connectionRepository.delete({
            status: 'disconnected',
            updatedAt: (0, typeorm_3.LessThan)(cutoffDate),
        });
        return { message: 'Old connections cleared' };
    }
};
exports.UserConnectionsService = UserConnectionsService;
exports.UserConnectionsService = UserConnectionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_connection_entity_1.UserConnection)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserConnectionsService);
//# sourceMappingURL=user-connections.service.js.map