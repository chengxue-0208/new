import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { VpnService } from './vpn.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vpn')
export class VpnController {
  constructor(private readonly vpnService: VpnService) {}

  @Post('connect')
  @UseGuards(JwtAuthGuard)
  async connect(@Body() connectionData: any, userId: string) {
    return this.vpnService.connect(userId, connectionData);
  }

  @Post('disconnect')
  @UseGuards(JwtAuthGuard)
  async disconnect(userId: string) {
    return this.vpnService.disconnect(userId);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getStatus(userId: string) {
    return this.vpnService.getStatus(userId);
  }

  @Get('config')
  @UseGuards(JwtAuthGuard)
  async getConfig(userId: string) {
    return this.vpnService.getConfig(userId);
  }
}