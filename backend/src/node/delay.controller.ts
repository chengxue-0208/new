import { Controller, Get, Post, Param } from '@nestjs/common';
import { DelayService } from './delay.service';
import { NodesService } from './node.service';

@Controller('node/delay')
export class DelayController {
  constructor(
    private readonly delayService: DelayService,
    private readonly nodeService: NodesService,
  ) {}

  @Get()
  async checkAll() {
    try {
      const delays = await this.delayService.checkAllNodesDelay();
      const stats = await this.delayService.getDelayStats();
      return {
        success: true,
        message: 'Delays updated successfully',
        delays,
        stats,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to check node delays',
        error: error.message,
      };
    }
  }

  @Get(':nodeId')
  async checkOne(@Param('nodeId') nodeId: string) {
    try {
      const delay = await this.delayService.checkNodeDelay(nodeId);
      return {
        success: true,
        nodeId,
        delay,
      };
    } catch (error: any) {
      return {
        success: false,
        nodeId,
        message: error.message,
      };
    }
  }

  @Post('update')
  async updateAll() {
    try {
      await this.delayService.checkAllNodesDelay();
      const stats = await this.delayService.getDelayStats();
      return {
        success: true,
        message: 'All node delays updated',
        stats,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update node delays',
        error: error.message,
      };
    }
  }

  @Get('stats')
  async getStats() {
    try {
      const stats = await this.delayService.getDelayStats();
      return {
        success: true,
        stats,
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to get delay stats',
        error: error.message,
      };
    }
  }
}