import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, User, SubscriptionPlan, OrderStatus, OrderPaymentMethod } from '../order/order.entity';
import { SubscriptionService } from '../subscription/subscription.service';

interface AlipayConfig {
  appId: string;
  privateKey: string;
  alipayPublicKey: string;
  gatewayUrl: string;
}

interface WeChatPayConfig {
  appId: string;
  mchId: string;
  apiKey: string;
  gatewayUrl: string;
}

interface AlipayPayRequest {
  orderNo: string;
  amount: number;
  subject: string;
}

interface WeChatPayRequest {
  orderNo: string;
  amount: number;
  body: string;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
    private subscriptionService: SubscriptionService,
  ) {}

  private getAlipayConfig(): AlipayConfig {
    return {
      appId: this.configService.get<string>('ALIPAY_APP_ID') || '',
      privateKey: this.configService.get<string>('ALIPAY_PRIVATE_KEY') || '',
      alipayPublicKey: this.configService.get<string>('ALIPAY_PUBLIC_KEY') || '',
      gatewayUrl: this.configService.get<string>('ALIPAY_GATEWAY_URL') || 'https://openapi.alipay.com/gateway.do',
    };
  }

  private getWeChatPayConfig(): WeChatPayConfig {
    return {
      appId: this.configService.get<string>('WECHAT_PAY_APP_ID') || '',
      mchId: this.configService.get<string>('WECHAT_PAY_MCH_ID') || '',
      apiKey: this.configService.get<string>('WECHAT_PAY_API_KEY') || '',
      gatewayUrl: this.configService.get<string>('WECHAT_PAY_GATEWAY_URL') || 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    };
  }

  async createAlipayPay(order: Order): Promise<{ payUrl: string }> {
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
      notify_url: `${this.configService.get<string>('BASE_URL')}/api/payment/callback/alipay`,
      return_url: `${this.configService.get<string>('BASE_URL')}/payment/success`,
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

  async createWeChatPay(order: Order): Promise<{ payUrl: string }> {
    const config = this.getWeChatPayConfig();

    if (!config.appId || !config.mchId || !config.apiKey) {
      throw new Error('WeChat Pay configuration incomplete');
    }

    const orderNo = order.id;
    const amount = (order.amount * 100).toFixed(2);

    const params: Record<string, any> = {
      appid: config.appId,
      mch_id: config.mchId,
      nonce_str: this.generateNonceStr(32),
      body: `VPN订阅 - ${order.planName}`,
      out_trade_no: orderNo,
      total_fee: amount,
      spbill_create_ip: '127.0.0.1',
      notify_url: `${this.configService.get<string>('BASE_URL')}/api/payment/callback/wechat`,
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

  async createPaymentRequest(userId: string, planId: string, paymentMethod: string): Promise<any> {
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
      totalAmount: plan.price,
      paymentMethod: OrderPaymentMethod[Object.keys(OrderPaymentMethod).find(k => OrderPaymentMethod[k] === paymentMethod) as keyof typeof OrderPaymentMethod] || OrderPaymentMethod.WALLET,
      status: OrderStatus.PENDING,
      discountAmount: 0,
      refundAmount: 0,
      pointsUsed: 0,
      pointsEarned: 0,
    });

    const savedOrder = await this.orderRepository.save(order);

    let payResult;
    if (paymentMethod === 'alipay') {
      payResult = await this.createAlipayPay(savedOrder);
    } else if (paymentMethod === 'wechat') {
      payResult = await this.createWeChatPay(savedOrder);
    } else {
      throw new Error('Unsupported payment method');
    }

    return {
      orderId: savedOrder.id,
      ...payResult,
    };
  }

  async handleAlipayCallback(queryParams: Record<string, any>): Promise<{ success: boolean; message: string }> {
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
        status: OrderStatus.PAID,
        paymentTransactionId: tradeNo,
        paidAt: new Date(),
      });
      await this.activateSubscriptionForPaidOrder(order, 'payment.alipay_callback');

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
    } catch (error: any) {
      this.logger.error(`Alipay callback error: ${error.message}`);
      return {
        success: false,
        message: 'Payment callback failed',
      };
    }
  }

  async handleWeChatCallback(xmlData: string): Promise<{ success: boolean; message: string }> {
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
        status: OrderStatus.PAID,
        paymentTransactionId: tradeNo,
        paidAt: new Date(),
      });
      await this.activateSubscriptionForPaidOrder(order, 'payment.wechat_callback');

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
    } catch (error: any) {
      this.logger.error(`WeChat Pay callback error: ${error.message}`);
      return {
        success: false,
        message: 'Payment callback failed',
      };
    }
  }

  private generateNonceStr(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateWeChatPaySign(params: Record<string, any>, apiKey: string): string {
    const sortedKeys = Object.keys(params).sort();
    const stringA = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
    const stringSignTemp = stringA + `&key=${apiKey}`;
    return this.md5(stringSignTemp).toUpperCase();
  }

  private md5(str: string): string {
    return require('crypto').createHash('md5').update(str).digest('hex');
  }

  private buildQueryString(params: Record<string, any>): string {
    const parts = [];
    for (const key in params) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
    return parts.join('&');
  }

  private async verifyAlipaySign(params: Record<string, any>, publicKey: string): Promise<boolean> {
    try {
      const sortedKeys = Object.keys(params).sort();
      const stringA = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
      const content = stringA;
      return this.verifySign(content, publicKey);
    } catch (error) {
      return false;
    }
  }

  private verifySign(content: string, publicKey: string): boolean {
    try {
      const crypto = require('crypto');
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(content);
      return verifier.verify(publicKey, Buffer.from('RSA', 'utf8'));
    } catch (error) {
      return false;
    }
  }

  private async activateSubscriptionForPaidOrder(order: Order, source: string): Promise<void> {
    if (!order.subscriptionPlanId) {
      return;
    }

    await this.subscriptionService.activatePlanForUser(order.userId, order.subscriptionPlanId, {
      source,
      orderId: order.id,
      orderNo: order.orderId,
    });
  }
}
