import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPayment(body: {
        planId: string;
        paymentMethod: string;
        userId: string;
    }): Promise<any>;
    handleAlipayCallback(queryParams: Record<string, any>): Promise<{
        success: boolean;
        message: string;
    }>;
    handleWeChatCallback(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyPayment(query: Record<string, any>): Promise<{
        success: boolean;
        message: any;
    }>;
}
