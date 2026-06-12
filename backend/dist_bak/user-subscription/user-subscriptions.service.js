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
exports.UserSubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_subscription_entity_1 = require("./user-subscription.entity");
const typeorm_3 = require("typeorm");
const user_subscription_entity_2 = require("./user-subscription.entity");
let UserSubscriptionsService = class UserSubscriptionsService {
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async create(subscriptionData) {
        const subscription = this.subscriptionRepository.create(subscriptionData);
        return this.subscriptionRepository.save(subscription);
    }
    async findAll() {
        return this.subscriptionRepository.find({
            relations: ['user', 'subscriptionPlan'],
            order: {
                createdAt: 'DESC',
            }
        });
    }
    async findOne(id) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { id },
            relations: ['user', 'subscriptionPlan'],
        });
        if (!subscription) {
            throw new common_1.NotFoundException('User subscription not found');
        }
        return subscription;
    }
    async update(id, subscriptionData) {
        await this.subscriptionRepository.update(id, subscriptionData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.subscriptionRepository.delete(id);
    }
    async findByUser(userId) {
        return this.subscriptionRepository.find({
            where: { userId },
            relations: ['subscriptionPlan'],
            order: { createdAt: 'DESC' }
        });
    }
    async findActive() {
        return this.subscriptionRepository.find({
            where: { status: user_subscription_entity_2.SubscriptionStatus.ACTIVE },
            relations: ['user', 'subscriptionPlan'],
            order: { endDate: 'DESC' }
        });
    }
    async findExpired() {
        const today = new Date();
        return this.subscriptionRepository.find({
            where: {
                status: user_subscription_entity_2.SubscriptionStatus.ACTIVE,
                endDate: (0, typeorm_3.LessThan)(today),
            },
            relations: ['user', 'subscriptionPlan'],
            order: { endDate: 'ASC' }
        });
    }
    async findByStatus(status) {
        return this.subscriptionRepository.find({
            where: { status },
            relations: ['user', 'subscriptionPlan'],
            order: { createdAt: 'DESC' }
        });
    }
    async getStats() {
        const total = await this.subscriptionRepository.count();
        const active = await this.subscriptionRepository.count({ where: { status: user_subscription_entity_2.SubscriptionStatus.ACTIVE } });
        const inactive = await this.subscriptionRepository.count({ where: { status: user_subscription_entity_2.SubscriptionStatus.INACTIVE } });
        const expired = await this.subscriptionRepository.count({ where: { status: user_subscription_entity_2.SubscriptionStatus.EXPIRED } });
        return {
            total,
            active,
            inactive,
            expired,
        };
    }
};
exports.UserSubscriptionsService = UserSubscriptionsService;
exports.UserSubscriptionsService = UserSubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_subscription_entity_1.UserSubscription)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserSubscriptionsService);
//# sourceMappingURL=user-subscriptions.service.js.map