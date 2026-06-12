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
exports.Region = void 0;
const typeorm_1 = require("typeorm");
const node_entity_1 = require("./node.entity");
let Region = class Region {
};
exports.Region = Region;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Region.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Region.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Region.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Region.prototype, "countryCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Region.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'asia' }),
    __metadata("design:type", String)
], Region.prototype, "continent", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'public' }),
    __metadata("design:type", String)
], Region.prototype, "networkType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'tcp' }),
    __metadata("design:type", String)
], Region.prototype, "protocol", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Region.prototype, "maxUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Region.prototype, "currentUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => node_entity_1.Node, (node) => node.regionEntity),
    __metadata("design:type", Array)
], Region.prototype, "nodes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Region.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Region.prototype, "updatedAt", void 0);
exports.Region = Region = __decorate([
    (0, typeorm_1.Entity)()
], Region);
//# sourceMappingURL=region.entity.js.map