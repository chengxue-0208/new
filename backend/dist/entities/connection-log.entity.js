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
exports.ConnectionLog = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const node_entity_1 = require("./node.entity");
let ConnectionLog = class ConnectionLog {
    constructor() {
        this.id = "";
        this.userId = "";
        this.nodeId = "";
        this.connectAt = new Date();
        this.disconnectAt = new Date();
        this.duration = 0;
        this.traffic = 0;
        this.status = "";
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
exports.ConnectionLog = ConnectionLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ConnectionLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], ConnectionLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], ConnectionLog.prototype, "nodeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], ConnectionLog.prototype, "connectAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ConnectionLog.prototype, "disconnectAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], ConnectionLog.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: '0' }),
    __metadata("design:type", Number)
], ConnectionLog.prototype, "traffic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['connected', 'disconnected', 'failed'], default: 'connected' }),
    __metadata("design:type", String)
], ConnectionLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ConnectionLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ConnectionLog.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.connections),
    __metadata("design:type", user_entity_1.User)
], ConnectionLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => node_entity_1.Node, node => node.configurations),
    __metadata("design:type", node_entity_1.Node)
], ConnectionLog.prototype, "node", void 0);
exports.ConnectionLog = ConnectionLog = __decorate([
    (0, typeorm_1.Entity)('connection_logs'),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['nodeId'])
], ConnectionLog);
//# sourceMappingURL=connection-log.entity.js.map