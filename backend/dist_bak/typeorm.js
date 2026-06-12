"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user/user.entity");
const node_entity_1 = require("./node/node.entity");
const subscription_plan_entity_1 = require("./subscription-plan/subscription-plan.entity");
const order_entity_1 = require("./order/order.entity");
const user_subscription_entity_1 = require("./user-subscription/user-subscription.entity");
const connection_log_entity_1 = require("./connection-log/connection-log.entity");
const system_log_entity_1 = require("./system-log/system-log.entity");
const vpn_configuration_entity_1 = require("./vpn/vpn-configuration.entity");
const dataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'admin1234',
    database: 'vpn_db',
    entities: [user_entity_1.User, node_entity_1.Node, subscription_plan_entity_1.SubscriptionPlan, order_entity_1.Order, user_subscription_entity_1.UserSubscription, connection_log_entity_1.ConnectionLog, system_log_entity_1.SystemLog, vpn_configuration_entity_1.VPNConfiguration],
    synchronize: false,
};
exports.dataSource = new typeorm_1.DataSource(dataSourceOptions);
//# sourceMappingURL=typeorm.js.map