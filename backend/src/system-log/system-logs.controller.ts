import { Controller, Get, Post, Delete, Query } from '@nestjs/common';
import { SystemLogsService } from './system-logs.service';

@Controller('system-logs')
export class SystemLogsController {
  constructor(private readonly systemLogsService: SystemLogsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.systemLogsService.findAll(query);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.systemLogsService.findByUser(userId);
  }

  @Get('level/:level')
  async findByLevel(@Param('level') level: string) {
    return this.systemLogsService.findByLevel(level);
  }

  @Get('source/:source')
  async findBySource(@Param('source') source: string) {
    return this.systemLogsService.findBySource(source);
  }

  @Get('search')
  async search(@Query('message') message: string) {
    return this.systemLogsService.search(message);
  }

  @Get('stats')
  async getStats() {
    return this.systemLogsService.getStats();
  }

  @Delete()
  async clearOldLogs() {
    return this.systemLogsService.clearOldLogs();
  }
}