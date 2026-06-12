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
exports.SubscriptionPlansController = void 0;
const common_1 = require("@nestjs/common");
const subscription_plans_service_1 = require("./subscription-plans.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SubscriptionPlansController = class SubscriptionPlansController {
    constructor(subscriptionPlansService) {
        this.subscriptionPlansService = subscriptionPlansService;
    }
    async findAll() {
        return this.subscriptionPlansService.findAll();
    }
    async findOne(id) {
        return this.subscriptionPlansService.findOne(id);
    }
    async create(planData) {
        return this.subscriptionPlansService.create(planData);
    }
    async update(id, planData) {
        return this.subscriptionPlansService.update(id, planData);
    }
    async remove(id) {
        return this.subscriptionPlansService.remove(id);
    }
};
exports.SubscriptionPlansController = SubscriptionPlansController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionPlansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionPlansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionPlansController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionPlansController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionPlansController.prototype, "remove", null);
exports.SubscriptionPlansController = SubscriptionPlansController = __decorate([
    (0, common_1.Controller)('subscription-plans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [subscription_plans_service_1.SubscriptionPlansService])
], SubscriptionPlansController);
//# sourceMappingURL=subscription-plans.controller.js.map