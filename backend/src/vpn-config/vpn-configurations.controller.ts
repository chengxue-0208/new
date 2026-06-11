import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { VPNConfigurationsService } from './vpn-configurations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vpn-configs')
@UseGuards(JwtAuthGuard)
export class VPNConfigurationsController {
  constructor(private readonly vpnConfigurationsService: VPNConfigurationsService) {}

  @Get()
  async findAll() {
    return this.vpnConfigurationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vpnConfigurationsService.findOne(id);
  }

  @Get('node/:nodeId')
  async findByNodeId(@Param('nodeId') nodeId: string) {
    return this.vpnConfigurationsService.findByNodeId(nodeId);
  }

  @Get('by-protocol/:protocol')
  async findByProtocol(@Param('protocol') protocol: string) {
    return this.vpnConfigurationsService.findByProtocol(protocol);
  }

  @Post()
  async create(@Body() configData: any) {
    return this.vpnConfigurationsService.create(configData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() configData: Partial<any>) {
    return this.vpnConfigurationsService.update(id, configData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.vpnConfigurationsService.remove(id);
  }
}