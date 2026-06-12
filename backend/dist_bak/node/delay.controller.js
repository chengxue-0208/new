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
exports.DelayController = void 0;
const common_1 = require("@nestjs/common");
const delay_service_1 = require("./delay.service");
const node_service_1 = require("./node.service");
let DelayController = class DelayController {
    constructor(delayService, nodeService) {
        this.delayService = delayService;
        this.nodeService = nodeService;
    }
    async checkAll() {
        try {
            const delays = await this.delayService.checkAllNodesDelay();
            const stats = await this.delayService.getDelayStats();
            return {
                success: true,
                message: 'Delays updated successfully',
                delays,
                stats,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to check node delays',
                error: error.message,
            };
        }
    }
    async checkOne(nodeId) {
        try {
            const delay = await this.delayService.checkNodeDelay(nodeId);
            return {
                success: true,
                nodeId,
                delay,
            };
        }
        catch (error) {
            return {
                success: false,
                nodeId,
                message: error.message,
            };
        }
    }
    async updateAll() {
        try {
            await this.delayService.checkAllNodesDelay();
            const stats = await this.delayService.getDelayStats();
            return {
                success: true,
                message: 'All node delays updated',
                stats,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to update node delays',
                error: error.message,
            };
        }
    }
    async getStats() {
        try {
            const stats = await this.delayService.getDelayStats();
            return {
                success: true,
                stats,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to get delay stats',
                error: error.message,
            };
        }
    }
};
exports.DelayController = DelayController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DelayController.prototype, "checkAll", null);
__decorate([
    (0, common_1.Get)(':nodeId'),
    __param(0, (0, common_1.Param)('nodeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DelayController.prototype, "checkOne", null);
__decorate([
    (0, common_1.Post)('update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DelayController.prototype, "updateAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DelayController.prototype, "getStats", null);
exports.DelayController = DelayController = __decorate([
    (0, common_1.Controller)('node/delay'),
    __metadata("design:paramtypes", [delay_service_1.DelayService,
        node_service_1.NodesService])
], DelayController);
//# sourceMappingURL=delay.controller.js.map