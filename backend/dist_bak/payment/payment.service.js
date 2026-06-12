"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../order/order.entity");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(configService, orderRepository, userRepository, planRepository) {
        this.configService = configService;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.planRepository = planRepository;
        this.logger = new common_1.Logger(PaymentService_1.name);
    }
    getAlipayConfig() {
        return {
            appId: this.configService.get('ALIPAY_APP_ID') || '',
            privateKey: this.configService.get('ALIPAY_PRIVATE_KEY') || '',
            alipayPublicKey: this.configService.get('ALIPAY_PUBLIC_KEY') || '',
            gatewayUrl: this.configService.get('ALIPAY_GATEWAY_URL') || 'https://openapi.alipay.com/gateway.do',
        };
    }
    getWeChatPayConfig() {
        return {
            appId: this.configService.get('WECHAT_PAY_APP_ID') || '',
            mchId: this.configService.get('WECHAT_PAY_MCH_ID') || '',
            apiKey: this.configService.get('WECHAT_PAY_API_KEY') || '',
            gatewayUrl: this.configService.get('WECHAT_PAY_GATEWAY_URL') || 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        };
    }
    async createAlipayPay(order) {
        const config = this.getAlipayConfig();
        if (!config.appId || !config.privateKey || !config.alipayPublicKey) {
            throw new Error('Alipay configuration incomplete');
        }
        const orderNo = order.id;
        const amount = (order.amount * 100).toFixed(2);
        const params = {
            app_id: config.appId,
            method: 'alipay.trade.page.pay',
            format: 'JSON',
            charset: 'UTF-8',
            sign_type: 'RSA2',
            timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
            version: '1.0',
            notify_url: `${this.configService.get('BASE_URL')}/api/payment/callback/alipay`,
            return_url: `${this.configService.get('BASE_URL')}/payment/success`,
            biz_content: JSON.stringify({
                out_trade_no: orderNo,
                product_code: 'FAST_INSTANT_TRADE_PAY',
                total_amount: amount,
                subject: `VPN订阅 - ${order.planName}`,
                timeout_express: '30m',
            }),
        };
        const payUrl = `${config.gatewayUrl}?${this.buildQueryString(params)}`;
        this.logger.log(`Created Alipay order: ${orderNo}`);
        return { payUrl };
    }
    async createWeChatPay(order) {
        const config = this.getWeChatPayConfig();
        if (!config.appId || !config.mchId || !config.apiKey) {
            throw new Error('WeChat Pay configuration incomplete');
        }
        const orderNo = order.id;
        const amount = (order.amount * 100).toFixed(2);
        const params = {
            appid: config.appId,
            mch_id: config.mchId,
            nonce_str: this.generateNonceStr(32),
            body: `VPN订阅 - ${order.planName}`,
            out_trade_no: orderNo,
            total_fee: amount,
            spbill_create_ip: '127.0.0.1',
            notify_url: `${this.configService.get('BASE_URL')}/api/payment/callback/wechat`,
            trade_type: 'JSAPI',
            key: config.apiKey,
        };
        const sign = this.generateWeChatPaySign(params, config.apiKey);
        params.sign = sign;
        const response = await fetch(config.gatewayUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: this.buildQueryString(params),
        });
        const result = await response.json();
        if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
            this.logger.log(`Created WeChat Pay order: ${orderNo}`);
            return { payUrl: result.code_url };
        }
        throw new Error(`WeChat Pay failed: ${result.err_code_des}`);
    }
    async createPaymentRequest(userId, planId, paymentMethod) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const plan = await this.planRepository.findOne({
            where: { id: planId },
        });
        if (!plan) {
            throw new Error('Plan not found');
        }
        const order = this.orderRepository.create({
            userId,
            orderId: 'order-' + Date.now(),
            subscriptionPlanId: plan.id,
            planName: plan.name,
            plan: plan.name || plan.type,
            amount: plan.price,
            paymentMethod: order_entity_1.OrderPaymentMethod[Object.keys(order_entity_1.OrderPaymentMethod).find(k => order_entity_1.OrderPaymentMethod[k] === paymentMethod)] || order_entity_1.OrderPaymentMethod.WALLET,
            status: order_entity_1.OrderStatus.PENDING,
            discountAmount: 0,
            refundAmount: 0,
            pointsUsed: 0,
            pointsEarned: 0,
        });
        const savedOrder = await this.orderRepository.save(order);
        let payResult;
        if (paymentMethod === 'alipay') {
            payResult = await this.createAlipayPay(savedOrder);
        }
        else if (paymentMethod === 'wechat') {
            payResult = await this.createWeChatPay(savedOrder);
        }
        else {
            throw new Error('Unsupported payment method');
        }
        return {
            orderId: savedOrder.id,
            ...payResult,
        };
    }
    async handleAlipayCallback(queryParams) {
        const config = this.getAlipayConfig();
        try {
            const sign = queryParams.sign;
            delete queryParams.sign;
            const isValid = await this.verifyAlipaySign(queryParams, config.alipayPublicKey);
            if (!isValid) {
                throw new Error('Invalid signature');
            }
            const orderNo = queryParams.out_trade_no;
            const tradeNo = queryParams.trade_no;
            const tradeStatus = queryParams.trade_status;
            const totalAmount = parseFloat(queryParams.total_amount);
            const order = await this.orderRepository.findOne({ where: { id: orderNo } });
            if (!order) {
                throw new Error('Order not found');
            }
            if (order.status === 'PAID') {
                return {
                    success: true,
                    message: 'Order already paid',
                };
            }
            if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
                await this.orderRepository.update(orderNo, {
                    status: order_entity_1.OrderStatus.PAID,
                    paymentTransactionId: tradeNo,
                    paidAt: new Date(),
                });
                this.logger.log(`Alipay callback processed: ${orderNo}`);
                return {
                    success: true,
                    message: 'Payment successful',
                };
            }
            return {
                success: false,
                message: 'Payment not completed',
            };
        }
        catch (error) {
            this.logger.error(`Alipay callback error: ${error.message}`);
            return {
                success: false,
                message: 'Payment callback failed',
            };
        }
    }
    async handleWeChatCallback(xmlData) {
        const config = this.getWeChatPayConfig();
        try {
            const xml = new DOMParser().parseFromString(xmlData, 'text/xml');
            const returnCode = xml.querySelector('return_code')?.textContent || '';
            const returnMsg = xml.querySelector('return_msg')?.textContent || '';
            if (returnCode !== 'SUCCESS') {
                throw new Error(returnMsg);
            }
            const outTradeNo = xml.querySelector('out_trade_no')?.textContent || '';
            const tradeNo = xml.querySelector('transaction_id')?.textContent || '';
            const tradeState = xml.querySelector('trade_state')?.textContent || '';
            const totalFee = xml.querySelector('total_fee')?.textContent || '';
            const order = await this.orderRepository.findOne({ where: { id: outTradeNo } });
            if (!order) {
                throw new Error('Order not found');
            }
            if (order.status === 'PAID') {
                return {
                    success: true,
                    message: 'Order already paid',
                };
            }
            if (tradeState === 'SUCCESS') {
                await this.orderRepository.update(outTradeNo, {
                    status: order_entity_1.OrderStatus.PAID,
                    paymentTransactionId: tradeNo,
                    paidAt: new Date(),
                });
                this.logger.log(`WeChat Pay callback processed: ${outTradeNo}`);
                return {
                    success: true,
                    message: 'Payment successful',
                };
            }
            return {
                success: false,
                message: 'Payment not completed',
            };
        }
        catch (error) {
            this.logger.error(`WeChat Pay callback error: ${error.message}`);
            return {
                success: false,
                message: 'Payment callback failed',
            };
        }
    }
    generateNonceStr(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    generateWeChatPaySign(params, apiKey) {
        const sortedKeys = Object.keys(params).sort();
        const stringA = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
        const stringSignTemp = stringA + `&key=${apiKey}`;
        return this.md5(stringSignTemp).toUpperCase();
    }
    md5(str) {
        return require('crypto').createHash('md5').update(str).digest('hex');
    }
    buildQueryString(params) {
        const parts = [];
        for (const key in params) {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
        }
        return parts.join('&');
    }
    async verifyAlipaySign(params, publicKey) {
        try {
            const sortedKeys = Object.keys(params).sort();
            const stringA = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
            const content = stringA;
            return this.verifySign(content, publicKey);
        }
        catch (error) {
            return false;
        }
    }
    verifySign(content, publicKey) {
        try {
            const crypto = require('crypto');
            const verifier = crypto.createVerify('RSA-SHA256');
            verifier.update(content);
            return verifier.verify(publicKey, Buffer.from('RSA', 'utf8'));
        }
        catch (error) {
            return false;
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.SubscriptionPlan)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map