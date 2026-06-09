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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const node_entity_1 = require("./node.entity");
const vpn_config_entity_1 = require("./vpn-config.entity");
const order_entity_1 = require("./order.entity");
const user_subscription_entity_1 = require("./user-subscription.entity");
let User = class User {
    constructor() {
        this.id = "";
        this.email = "";
        this.passwordHash = "";
        this.balance = 0;
        this.subscriptionStatus = "";
        this.subscriptionPlanId = "";
        this.subscriptionExpiresAt = new Date();
        this.trafficUsed = 0;
        this.trafficLimit = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
        default: 'ACTIVE'
    }),
    __metadata("design:type", String)
], User.prototype, "subscriptionStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "subscriptionPlanId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "subscriptionExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "trafficUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: '0' }),
    __metadata("design:type", Number)
], User.prototype, "trafficLimit", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => node_entity_1.Node, node => node.user),
    __metadata("design:type", Array)
], User.prototype, "nodes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vpn_config_entity_1.VpnConfiguration, config => config.user),
    __metadata("design:type", Array)
], User.prototype, "connections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, order => order.user),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_subscription_entity_1.UserSubscription, subscription => subscription.user),
    __metadata("design:type", Array)
], User.prototype, "subscriptions", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)(['email'], { unique: true }),
    (0, typeorm_1.Index)(['subscriptionStatus', 'subscriptionExpiresAt'])
], User);
//# sourceMappingURL=user.entity.js.map