"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpnModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vpn_controller_1 = require("./vpn.controller");
const vpn_service_1 = require("./vpn.service");
const user_entity_1 = require("../user/user.entity");
const connection_log_entity_1 = require("../connection-log/connection-log.entity");
let VpnModule = class VpnModule {
};
exports.VpnModule = VpnModule;
exports.VpnModule = VpnModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_entity_1.Node, user_entity_1.VPNConfiguration, connection_log_entity_1.ConnectionLog]),
        ],
        controllers: [vpn_controller_1.VpnController],
        providers: [vpn_service_1.VpnService],
        exports: [vpn_service_1.VpnService],
    })
], VpnModule);
//# sourceMappingURL=vpn.module.js.map