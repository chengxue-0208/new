import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    findAll(): Promise<import("../entities").Order[]>;
    findOne(id: string): Promise<import("../entities").Order>;
}
