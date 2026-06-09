import { Repository } from 'typeorm';
import { Order, User } from '../entities';
export declare class OrderService {
    private orderRepository;
    private userRepository;
    constructor(orderRepository: Repository<Order>, userRepository: Repository<User>);
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    create(purchaseData: any, userId: string): Promise<Order>;
    updateStatus(id: string, status: string): Promise<Order>;
}
