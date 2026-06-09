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
exports.VpnService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let VpnService = class VpnService {
    constructor(userRepository, nodeRepository, vpnConfigRepository, connectionLogRepository) {
        this.userRepository = userRepository;
        this.nodeRepository = nodeRepository;
        this.vpnConfigRepository = vpnConfigRepository;
        this.connectionLogRepository = connectionLogRepository;
    }
    async connect(userId, connectionData) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || user.subscriptionStatus !== 'ACTIVE') {
            throw new Error('Subscription expired');
        }
        const node = await this.nodeRepository.findOne({
            where: { id: connectionData.nodeId },
        });
        if (!node || node.status !== 'online') {
            throw new Error('Node unavailable');
        }
        const config = this.vpnConfigRepository.create({
            userId,
            nodeId: node.id,
            protocol: node.protocol,
            address: node.address,
            port: node.port,
            path: node.path,
            serverName: node.serverName,
            createdAt: new Date(),
        });
        await this.vpnConfigRepository.save(config);
        const log = this.connectionLogRepository.create({
            userId,
            nodeId: node.id,
            connectAt: new Date(),
            status: 'connected',
        });
        await this.connectionLogRepository.save(log);
        await this.userRepository.update(userId, {
            trafficUsed: (user.trafficUsed || 0) + 1024 * 1024 * 10,
        });
        return config;
    }
    async disconnect(userId) {
        const config = await this.vpnConfigRepository.findOne({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        if (!config) {
            throw new Error('No active connection');
        }
        const log = this.connectionLogRepository.create({
            userId,
            nodeId: config.nodeId,
            connectAt: config.createdAt,
            disconnectAt: new Date(),
            status: 'disconnected',
        });
        await this.connectionLogRepository.save(log);
        await this.vpnConfigRepository.delete(config.id);
        return { message: 'Disconnected' };
    }
    async getStatus(userId) {
        const config = await this.vpnConfigRepository.findOne({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        if (!config) {
            return { connected: false };
        }
        const node = await this.nodeRepository.findOne({
            where: { id: config.nodeId },
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        return {
            connected: true,
            node,
            trafficUsed: user?.trafficUsed || 0,
        };
    }
    async getConfig(userId) {
        return this.getStatus(userId);
    }
};
exports.VpnService = VpnService;
exports.VpnService = VpnService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Node)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.VpnConfiguration)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.ConnectionLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VpnService);
//# sourceMappingURL=vpn.service.js.map