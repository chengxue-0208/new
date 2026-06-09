import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { Order } from '../entities/order.entity';
export declare class UsersService {
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
}
