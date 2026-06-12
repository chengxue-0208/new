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
exports.UserConnection = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const node_entity_1 = require("../node/node.entity");
const vpn_configuration_entity_1 = require("../vpn/vpn-configuration.entity");
let UserConnection = class UserConnection {
};
exports.UserConnection = UserConnection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserConnection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserConnection.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserConnection.prototype, "nodeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserConnection.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserConnection.prototype, "vpnIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], UserConnection.prototype, "vpnPort", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], UserConnection.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserConnection.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserConnection.prototype, "disconnectReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserConnection.prototype, "reconnectCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], UserConnection.prototype, "bandwidthIn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], UserConnection.prototype, "bandwidthOut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], UserConnection.prototype, "connectionDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], UserConnection.prototype, "disconnectTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'tcp' }),
    __metadata("design:type", String)
], UserConnection.prototype, "protocol", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], UserConnection.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => node_entity_1.Node),
    (0, typeorm_1.JoinColumn)({ name: 'nodeId' }),
    __metadata("design:type", node_entity_1.Node)
], UserConnection.prototype, "node", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vpn_configuration_entity_1.VPNConfiguration),
    (0, typeorm_1.JoinColumn)({ name: 'configId' }),
    __metadata("design:type", vpn_configuration_entity_1.VPNConfiguration)
], UserConnection.prototype, "config", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], UserConnection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], UserConnection.prototype, "updatedAt", void 0);
exports.UserConnection = UserConnection = __decorate([
    (0, typeorm_1.Entity)()
], UserConnection);
//# sourceMappingURL=user-connection.entity.js.map