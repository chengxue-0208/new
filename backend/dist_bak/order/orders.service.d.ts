import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
export declare class OrdersService {
    private orderRepository;
    private planRepository;
    constructor(orderRepository: Repository<Order>, planRepository: Repository<SubscriptionPlan>);
    create(orderData: Partial<Order>): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    update(id: string, orderData: Partial<Order>): Promise<Order>;
    remove(id: string): Promise<void>;
    findByUser(userId: string): Promise<Order[]>;
    findByStatus(status: string): Promise<Order[]>;
}
