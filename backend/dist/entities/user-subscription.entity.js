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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscription = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const subscription_plan_entity_1 = require("./subscription-plan.entity");
let UserSubscription = class UserSubscription {
    constructor() {
        this.id = "";
        this.userId = "";
        this.subscriptionPlanId = "";
        this.pricePaid = 0;
        this.status = "";
        this.expiresAt = new Date();
        this.trafficUsed = 0;
        this.trafficLimit = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
exports.UserSubscription = UserSubscription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserSubscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserSubscription.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserSubscription.prototype, "subscriptionPlanId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], UserSubscription.prototype, "pricePaid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserSubscription.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], UserSubscription.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: '0' }),
    __metadata("design:type", Number)
], UserSubscription.prototype, "trafficUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: '0' }),
    __metadata("design:type", Number)
], UserSubscription.prototype, "trafficLimit", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserSubscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UserSubscription.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.subscriptions),
    __metadata("design:type", user_entity_1.User)
], UserSubscription.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_plan_entity_1.SubscriptionPlan, plan => plan.subscriptions),
    __metadata("design:type", subscription_plan_entity_1.SubscriptionPlan)
], UserSubscription.prototype, "subscriptionPlan", void 0);
exports.UserSubscription = UserSubscription = __decorate([
    (0, typeorm_1.Entity)('user_subscriptions'),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['subscriptionPlanId']),
    (0, typeorm_1.Index)(['expiresAt'])
], UserSubscription);
//# sourceMappingURL=user-subscription.entity.js.map