import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(): Promise<import("./order.entity").Order[]>;
    findOne(id: string): Promise<import("./order.entity").Order>;
    findByUser(userId: string): Promise<import("./order.entity").Order[]>;
    findByStatus(status: string): Promise<import("./order.entity").Order[]>;
    create(orderData: any): Promise<import("./order.entity").Order>;
    update(id: string, orderData: Partial<any>): Promise<import("./order.entity").Order>;
    remove(id: string): Promise<void>;
}
