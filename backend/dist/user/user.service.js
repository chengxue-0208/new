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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const subscription_plan_entity_1 = require("../entities/subscription-plan.entity");
const order_entity_1 = require("../entities/order.entity");
let UsersService = class UsersService {
    constructor(userRepository, planRepository, orderRepository) {
        this.userRepository = userRepository;
        this.planRepository = planRepository;
        this.orderRepository = orderRepository;
    }
    async create(userData) {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }
    async findAll() {
        return this.userRepository.find({
            relations: ['subscriptionPlan', 'orders', 'connections', 'subscriptions'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['subscriptionPlan', 'orders', 'connections', 'subscriptions'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async update(id, userData) {
        await this.userRepository.update(id, userData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.userRepository.delete(id);
    }
    async getSubscriptionStatus(id) {
        const user = await this.findOne(id);
        return {
            userId: user.id,
            email: user.email,
            status: user.subscriptionStatus,
            expiresAt: user.subscriptionExpiresAt,
            balance: user.balance,
            trafficUsed: user.trafficUsed,
            trafficLimit: user.trafficLimit
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_plan_entity_1.SubscriptionPlan)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=user.service.js.map