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
exports.UserSubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const user_subscriptions_service_1 = require("./user-subscriptions.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let UserSubscriptionsController = class UserSubscriptionsController {
    constructor(userSubscriptionsService) {
        this.userSubscriptionsService = userSubscriptionsService;
    }
    async findAll() {
        return this.userSubscriptionsService.findAll();
    }
    async findByUser(userId) {
        return this.userSubscriptionsService.findByUser(userId);
    }
    async findActive() {
        return this.userSubscriptionsService.findActive();
    }
    async findExpired() {
        return this.userSubscriptionsService.findExpired();
    }
    async findByStatus(status) {
        return this.userSubscriptionsService.findByStatus(status);
    }
    async getStats() {
        return this.userSubscriptionsService.getStats();
    }
    async create(subscriptionData) {
        return this.userSubscriptionsService.create(subscriptionData);
    }
    async update(id, subscriptionData) {
        return this.userSubscriptionsService.update(id, subscriptionData);
    }
    async remove(id) {
        return this.userSubscriptionsService.remove(id);
    }
};
exports.UserSubscriptionsController = UserSubscriptionsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserSubscriptionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserSubscriptionsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserSubscriptionsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('expired'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserSubscriptionsController.prototype, "findExpired", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserSubscriptionsController.prototype, "findByStatus", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserSubscriptionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSubscriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserSubscriptionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserSubscriptionsController.prototype, "remove", null);
exports.UserSubscriptionsController = UserSubscriptionsController = __decorate([
    (0, common_1.Controller)('user-subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_subscriptions_service_1.UserSubscriptionsService])
], UserSubscriptionsController);
//# sourceMappingURL=user-subscriptions.controller.js.map