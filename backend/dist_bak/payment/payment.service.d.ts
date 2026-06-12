import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Order, User, SubscriptionPlan } from '../order/order.entity';
export declare class PaymentService {
    private configService;
    private orderRepository;
    private userRepository;
    private planRepository;
    private readonly logger;
    constructor(configService: ConfigService, orderRepository: Repository<Order>, userRepository: Repository<User>, planRepository: Repository<SubscriptionPlan>);
    private getAlipayConfig;
    private getWeChatPayConfig;
    createAlipayPay(order: Order): Promise<{
        payUrl: string;
    }>;
    createWeChatPay(order: Order): Promise<{
        payUrl: string;
    }>;
    createPaymentRequest(userId: string, planId: string, paymentMethod: string): Promise<any>;
    handleAlipayCallback(queryParams: Record<string, any>): Promise<{
        success: boolean;
        message: string;
    }>;
    handleWeChatCallback(xmlData: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateNonceStr;
    private generateWeChatPaySign;
    private md5;
    private buildQueryString;
    private verifyAlipaySign;
    private verifySign;
}
