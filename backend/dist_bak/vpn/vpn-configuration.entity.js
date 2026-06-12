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
exports.VPNConfiguration = void 0;
const typeorm_1 = require("typeorm");
const node_entity_1 = require("../node/node.entity");
const user_connection_entity_1 = require("../user/user-connection.entity");
let VPNConfiguration = class VPNConfiguration {
};
exports.VPNConfiguration = VPNConfiguration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], VPNConfiguration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VPNConfiguration.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VPNConfiguration.prototype, "nodeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], VPNConfiguration.prototype, "protocol", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], VPNConfiguration.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], VPNConfiguration.prototype, "dns", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], VPNConfiguration.prototype, "encryption", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], VPNConfiguration.prototype, "compression", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], VPNConfiguration.prototype, "bandwidth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], VPNConfiguration.prototype, "maxConnections", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], VPNConfiguration.prototype, "currentConnections", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], VPNConfiguration.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], VPNConfiguration.prototype, "statusMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], VPNConfiguration.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], VPNConfiguration.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => node_entity_1.Node, (node) => node.configs),
    (0, typeorm_1.JoinColumn)({ name: 'nodeId' }),
    __metadata("design:type", node_entity_1.Node)
], VPNConfiguration.prototype, "node", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_connection_entity_1.UserConnection, (connection) => connection.config),
    __metadata("design:type", Array)
], VPNConfiguration.prototype, "connections", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], VPNConfiguration.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], VPNConfiguration.prototype, "updatedAt", void 0);
exports.VPNConfiguration = VPNConfiguration = __decorate([
    (0, typeorm_1.Entity)('vpn_configuration')
], VPNConfiguration);
//# sourceMappingURL=vpn-configuration.entity.js.map