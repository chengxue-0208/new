"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const delay_controller_1 = require("./delay.controller");
const delay_service_1 = require("./delay.service");
const node_entity_1 = require("./node.entity");
let NodeModule = class NodeModule {
};
exports.NodeModule = NodeModule;
exports.NodeModule = NodeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([node_entity_1.Node])],
        controllers: [NodeController, delay_controller_1.DelayController],
        providers: [NodeService, delay_service_1.DelayService],
        exports: [NodeService, delay_service_1.DelayService],
    })
], NodeModule);
//# sourceMappingURL=node.module.js.map