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
exports.UserConnectionsController = void 0;
const common_1 = require("@nestjs/common");
const user_connections_service_1 = require("./user-connections.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let UserConnectionsController = class UserConnectionsController {
    constructor(userConnectionsService) {
        this.userConnectionsService = userConnectionsService;
    }
    async findAll() {
        return this.userConnectionsService.findAll();
    }
    async findByUser(userId) {
        return this.userConnectionsService.findByUser(userId);
    }
    async findByNode(nodeId) {
        return this.userConnectionsService.findByNode(nodeId);
    }
    async findActive() {
        return this.userConnectionsService.findActive();
    }
    async findDisconnected() {
        return this.userConnectionsService.findDisconnected();
    }
    async clearOldConnections() {
        return this.userConnectionsService.clearOldConnections();
    }
    async remove(id) {
        return this.userConnectionsService.remove(id);
    }
};
exports.UserConnectionsController = UserConnectionsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserConnectionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserConnectionsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('node/:nodeId'),
    __param(0, (0, common_1.Param)('nodeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserConnectionsController.prototype, "findByNode", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserConnectionsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('disconnected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserConnectionsController.prototype, "findDisconnected", null);
__decorate([
    (0, common_1.Delete)('clear'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserConnectionsController.prototype, "clearOldConnections", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserConnectionsController.prototype, "remove", null);
exports.UserConnectionsController = UserConnectionsController = __decorate([
    (0, common_1.Controller)('user-connections'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_connections_service_1.UserConnectionsService])
], UserConnectionsController);
//# sourceMappingURL=user-connections.controller.js.map