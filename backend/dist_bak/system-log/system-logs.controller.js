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
exports.SystemLogsController = void 0;
const common_1 = require("@nestjs/common");
const system_logs_service_1 = require("./system-logs.service");
const system_log_entity_1 = require("./system-log.entity");
let SystemLogsController = class SystemLogsController {
    constructor(systemLogsService) {
        this.systemLogsService = systemLogsService;
    }
    async findAll(query) {
        return this.systemLogsService.findAll(query);
    }
    async findByUser(userId) {
        return this.systemLogsService.findByUser(userId);
    }
    async findByLevel(level) {
        return this.systemLogsService.findByLevel(level);
    }
    async findBySource(source) {
        return this.systemLogsService.findBySource(source);
    }
    async search(message) {
        return this.systemLogsService.search(message);
    }
    async getStats() {
        return this.systemLogsService.getStats();
    }
    async clearOldLogs() {
        return this.systemLogsService.clearOldLogs();
    }
};
exports.SystemLogsController = SystemLogsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemLogsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('level/:level'),
    __param(0, (0, common_1.Param)('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemLogsController.prototype, "findByLevel", null);
__decorate([
    (0, common_1.Get)('source/:source'),
    __param(0, (0, common_1.Param)('source')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemLogsController.prototype, "findBySource", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemLogsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemLogsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemLogsController.prototype, "clearOldLogs", null);
exports.SystemLogsController = SystemLogsController = __decorate([
    (0, common_1.Controller)('system-logs'),
    __metadata("design:paramtypes", [system_logs_service_1.SystemLogsService])
], SystemLogsController);
//# sourceMappingURL=system-logs.controller.js.map