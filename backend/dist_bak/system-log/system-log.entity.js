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
exports.SystemLog = exports.LogSource = exports.LogLevel = void 0;
const typeorm_1 = require("typeorm");
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARNING"] = "WARNING";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["CRITICAL"] = "CRITICAL";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var LogSource;
(function (LogSource) {
    LogSource["USER_SERVICE"] = "USER_SERVICE";
    LogSource["NODE_SERVICE"] = "NODE_SERVICE";
    LogSource["VPN_SERVICE"] = "VPN_SERVICE";
    LogSource["PAYMENT_SERVICE"] = "PAYMENT_SERVICE";
    LogSource["SUBSCRIPTION_SERVICE"] = "SUBSCRIPTION_SERVICE";
    LogSource["SYSTEM"] = "SYSTEM";
})(LogSource || (exports.LogSource = LogSource = {}));
let SystemLog = class SystemLog {
};
exports.SystemLog = SystemLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SystemLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LogLevel }),
    __metadata("design:type", String)
], SystemLog.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LogSource }),
    __metadata("design:type", String)
], SystemLog.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SystemLog.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SystemLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SystemLog.prototype, "nodeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SystemLog.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SystemLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SystemLog.prototype, "responseTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SystemLog.prototype, "stackTrace", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], SystemLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], SystemLog.prototype, "updatedAt", void 0);
exports.SystemLog = SystemLog = __decorate([
    (0, typeorm_1.Entity)('system_log')
], SystemLog);
//# sourceMappingURL=system-log.entity.js.map