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
var DelayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const node_entity_1 = require("./node.entity");
let DelayService = DelayService_1 = class DelayService {
    constructor(nodeRepository) {
        this.nodeRepository = nodeRepository;
        this.logger = new common_1.Logger(DelayService_1.name);
    }
    async checkNodeDelay(nodeId) {
        const node = await this.nodeRepository.findOne({ where: { id: nodeId } });
        if (!node) {
            throw new Error('Node not found');
        }
        const startTime = Date.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`https://${node.ipAddress}`, {
                method: 'GET',
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            const endTime = Date.now();
            const delay = endTime - startTime;
            this.logger.debug(`Node ${node.name} delay: ${delay}ms`);
            await this.nodeRepository.update(nodeId, { delay });
            return delay;
        }
        catch (error) {
            this.logger.warn(`Node ${node.name} delay check failed: ${error.message}`);
            await this.nodeRepository.update(nodeId, { delay: -1 });
            return -1;
        }
    }
    async checkAllNodesDelay() {
        const nodes = await this.nodeRepository.find();
        const delayResults = await Promise.all(nodes.map(async (node) => {
            const delay = await this.checkNodeDelay(node.id);
            return { ...node, delay };
        }));
        return delayResults;
    }
    async updateNodeDelay(nodeId) {
        return this.checkNodeDelay(nodeId);
    }
    async getDelayStats() {
        const nodes = await this.nodeRepository.find();
        const onlineNodes = nodes.filter(node => node.status === 'online');
        const onlineDelays = onlineNodes
            .filter(node => node.delay > 0)
            .map(node => node.delay);
        const total = onlineNodes.length;
        const online = onlineDelays.length;
        const offline = total - online;
        const avgDelay = onlineDelays.length > 0
            ? Math.round(onlineDelays.reduce((a, b) => a + b, 0) / onlineDelays.length)
            : 0;
        return {
            total,
            online,
            offline,
            avgDelay,
        };
    }
};
exports.DelayService = DelayService;
exports.DelayService = DelayService = DelayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(node_entity_1.Node)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DelayService);
//# sourceMappingURL=delay.service.js.map