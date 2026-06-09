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
const user_entity_1 = require("./user.entity");
const vpn_config_entity_1 = require("./vpn-config.entity");
let Node = class Node {
    constructor() {
        this.id = "";
        this.name = "";
        this.region = "";
        this.protocol = "";
        this.address = "";
        this.port = 0;
        this.path = "";
        this.serverName = "";
        this.delay = 0;
        this.status = "";
        this.isFree = false;
        this.user = null;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
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
], Node.prototype, "protocol", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Node.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Node.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Node.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Node.prototype, "serverName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Node.prototype, "delay", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['online', 'offline'],
        default: 'online'
    }),
    __metadata("design:type", String)
], Node.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Node.prototype, "isFree", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.nodes),
    __metadata("design:type", user_entity_1.User)
], Node.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vpn_config_entity_1.VpnConfiguration, config => config.node),
    __metadata("design:type", Array)
], Node.prototype, "configurations", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Node.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Node.prototype, "updatedAt", void 0);
exports.Node = Node = __decorate([
    (0, typeorm_1.Entity)('nodes'),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['region']),
    (0, typeorm_1.Index)(['delay'])
], Node);
//# sourceMappingURL=node.entity.js.map