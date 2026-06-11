import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { NodesService } from './node.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VPNConfiguration } from '../vpn/vpn-configuration.entity';
import { UserConnection } from '../user/user-connection.entity';

@Controller('nodes')
@UseGuards(JwtAuthGuard)
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get()
  async findAll() {
    return this.nodesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.nodesService.findOne(id);
  }

  @Get('by-region/:region')
  async findByRegion(@Param('region') region: string) {
    return this.nodesService.findByRegion(region);
  }

  @Get('health')
  async checkHealth() {
    return this.nodesService.checkHealth();
  }

  @Post()
  async create(@Body() nodeData: any) {
    return this.nodesService.create(nodeData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() nodeData: Partial<any>) {
    return this.nodesService.update(id, nodeData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.nodesService.remove(id);
  }
}