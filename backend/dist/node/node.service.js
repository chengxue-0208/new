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
exports.NodesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const node_entity_1 = require("./node.entity");
let NodesService = class NodesService {
    constructor(nodeRepository) {
        this.nodeRepository = nodeRepository;
    }
    async create(nodeData) {
        const node = this.nodeRepository.create(nodeData);
        return this.nodeRepository.save(node);
    }
    async findAll() {
        return this.nodeRepository.find({
            relations: ['config', 'connections'],
            order: {
                createdAt: 'DESC',
                region: 'ASC'
            }
        });
    }
    async findOne(id) {
        const node = await this.nodeRepository.findOne({
            where: { id },
            relations: ['config', 'connections'],
        });
        if (!node) {
            throw new common_1.NotFoundException('Node not found');
        }
        return node;
    }
    async update(id, nodeData) {
        await this.nodeRepository.update(id, nodeData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.nodeRepository.delete(id);
    }
    async findByRegion(region) {
        return this.nodeRepository.find({
            where: { region },
            relations: ['config'],
            order: { name: 'ASC' }
        });
    }
    async checkHealth() {
        const nodes = await this.findAll();
        return {
            total: nodes.length,
            online: nodes.filter(n => n.status === 'online').length,
            offline: nodes.filter(n => n.status === 'offline').length,
            nodes: nodes.map(node => ({
                id: node.id,
                name: node.name,
                region: node.region,
                status: node.status,
                statusMessage: node.statusMessage,
                uptime: node.uptime,
            }))
        };
    }
};
exports.NodesService = NodesService;
exports.NodesService = NodesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(node_entity_1.Node)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NodesService);
//# sourceMappingURL=node.service.js.map