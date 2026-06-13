import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { VpnService } from './vpn.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vpn')
export class VpnController {
  constructor(private readonly vpnService: VpnService) {}

  @Post('connect')
  @UseGuards(JwtAuthGuard)
  async connect(@Body() connectionData: any, @Request() req: any) {
    return this.vpnService.connect(req.user.userId, connectionData);
  }

  @Post('disconnect')
  @UseGuards(JwtAuthGuard)
  async disconnect(@Request() req: any) {
    return this.vpnService.disconnect(req.user.userId);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getStatus(@Request() req: any) {
    return this.vpnService.getStatus(req.user.userId);
  }

  @Get('config')
  @UseGuards(JwtAuthGuard)
  async getConfig(@Request() req: any) {
    return this.vpnService.getConfig(req.user.userId);
  }
}
