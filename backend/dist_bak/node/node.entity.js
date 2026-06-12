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
exports.Node = void 0;
const typeorm_1 = require("typeorm");
const vpn_configuration_entity_1 = require("../vpn/vpn-configuration.entity");
const user_connection_entity_1 = require("../user/user-connection.entity");
const region_entity_1 = require("./region.entity");
let Node = class Node {
};
exports.Node = Node;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Node.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Node.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Node.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Node.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Node.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Node.prototype, "serverAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Node.prototype, "serverPort", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'online' }),
    __metadata("design:type", String)
], Node.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Node.prototype, "statusMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], Node.prototype, "uptime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Node.prototype, "maxConnections", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Node.prototype, "currentConnections", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Node.prototype, "delay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Node.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Node.prototype, "load", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Node.prototype, "bandwidth", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => region_entity_1.Region),
    (0, typeorm_1.JoinColumn)({ name: 'regionId' }),
    __metadata("design:type", region_entity_1.Region)
], Node.prototype, "regionEntity", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vpn_configuration_entity_1.VPNConfiguration, (config) => config.node),
    __metadata("design:type", Array)
], Node.prototype, "configs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_connection_entity_1.UserConnection, (connection) => connection.node),
    __metadata("design:type", Array)
], Node.prototype, "connections", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Node.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Node.prototype, "updatedAt", void 0);
exports.Node = Node = __decorate([
    (0, typeorm_1.Entity)('node')
], Node);
//# sourceMappingURL=node.entity.js.map