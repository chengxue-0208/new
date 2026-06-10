import { Controller, Post, Get, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createPayment(
    @Body() body: { planId: string; paymentMethod: string; userId: string },
  ) {
    try {
      const result = await this.paymentService.createPaymentRequest(
        body.userId,
        body.planId,
        body.paymentMethod,
      );

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('callback/alipay')
  @HttpCode(HttpStatus.OK)
  async handleAlipayCallback(@Query() queryParams: Record<string, any>) {
    const result = await this.paymentService.handleAlipayCallback(queryParams);
    return result;
  }

  @Post('callback/wechat')
  @HttpCode(HttpStatus.OK)
  async handleWeChatCallback(@Body() body: any) {
    const result = await this.paymentService.handleWeChatCallback(body);
    return result;
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  async verifyPayment(@Query() query: Record<string, any>) {
    try {
      const result = await this.paymentService.handleAlipayCallback(query);
      return {
        success: true,
        ...result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}