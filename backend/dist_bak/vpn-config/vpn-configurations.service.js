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
exports.VPNConfigurationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vpn_config_entity_1 = require("./vpn-config.entity");
const node_entity_1 = require("../node/node.entity");
let VPNConfigurationsService = class VPNConfigurationsService {
    constructor(configRepository, nodeRepository) {
        this.configRepository = configRepository;
        this.nodeRepository = nodeRepository;
    }
    async create(configData) {
        const config = this.configRepository.create(configData);
        return this.configRepository.save(config);
    }
    async findAll() {
        return this.configRepository.find({
            relations: ['node'],
            order: {
                name: 'ASC',
                port: 'ASC',
            }
        });
    }
    async findOne(id) {
        const config = await this.configRepository.findOne({
            where: { id },
            relations: ['node'],
        });
        if (!config) {
            throw new common_1.NotFoundException('VPN configuration not found');
        }
        return config;
    }
    async update(id, configData) {
        await this.configRepository.update(id, configData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.configRepository.delete(id);
    }
    async findByNodeId(nodeId) {
        return this.configRepository.find({
            where: { nodeId },
            order: { name: 'ASC' }
        });
    }
    async findByProtocol(protocol) {
        return this.configRepository.find({
            where: { protocol },
            relations: ['node'],
            order: { port: 'ASC' }
        });
    }
};
exports.VPNConfigurationsService = VPNConfigurationsService;
exports.VPNConfigurationsService = VPNConfigurationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vpn_config_entity_1.VPNConfiguration)),
    __param(1, (0, typeorm_1.InjectRepository)(node_entity_1.Node)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VPNConfigurationsService);
//# sourceMappingURL=vpn-configurations.service.js.map