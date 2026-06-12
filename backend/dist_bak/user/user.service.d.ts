import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
import { Order } from '../order/order.entity';
export declare class UserService {
    private userRepository;
    private planRepository;
    private orderRepository;
    constructor(userRepository: Repository<User>, planRepository: Repository<SubscriptionPlan>, orderRepository: Repository<Order>);
    create(userData: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, userData: Partial<User>): Promise<User>;
    remove(id: string): Promise<void>;
    getSubscriptionStatus(id: string): Promise<any>;
}
