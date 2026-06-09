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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let SubscriptionService = class SubscriptionService {
    constructor(userRepository, planRepository) {
        this.userRepository = userRepository;
        this.planRepository = planRepository;
    }
    async getPlans() {
        return this.planRepository.find({
            where: { isActive: true },
            order: { displayOrder: 'ASC' },
        });
    }
    async getMySubscription(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        return {
            subscriptionStatus: user?.subscriptionStatus || 'EXPIRED',
            subscriptionExpiresAt: user?.subscriptionExpiresAt,
            trafficUsed: user?.trafficUsed || 0,
            trafficLimit: user?.trafficLimit || 0n,
        };
    }
    async purchase(purchaseData, userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const plan = await this.planRepository.findOne({
            where: { id: purchaseData.planId },
        });
        if (!plan) {
            throw new Error('Plan not found');
        }
        const newSubscription = {
            userId,
            planId: plan.id,
            startAt: new Date(),
            endAt: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000),
            trafficLimit: plan.monthlyTraffic,
        };
        await this.userRepository.update(userId, {
            subscriptionPlanId: plan.id,
            subscriptionExpiresAt: newSubscription.endAt,
            subscriptionStatus: 'ACTIVE',
        });
        return newSubscription;
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.SubscriptionPlan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map