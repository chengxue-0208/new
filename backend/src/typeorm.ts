import { Entity, DataSource, DataSourceOptions } from 'typeorm';
import { User } from './user/user.entity';
import { Node } from './node/node.entity';
import { SubscriptionPlan } from './subscription-plan/subscription-plan.entity';
import { Order } from './order/order.entity';
import { UserSubscription } from './user-subscription/user-subscription.entity';
import { ConnectionLog } from './connection-log/connection-log.entity';
import { SystemLog } from './system-log/system-log.entity';
import { VPNConfiguration } from './vpn/vpn-configuration.entity';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin1234',
  database: 'vpn_db',
  entities: [User, Node, SubscriptionPlan, Order, UserSubscription, ConnectionLog, SystemLog, VPNConfiguration],
  synchronize: false,
};

export const dataSource = new DataSource(dataSourceOptions);