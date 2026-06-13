import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SystemLogsService } from './system-logs.service';

@Controller('logs')
@UseGuards(JwtAuthGuard)
export class LogsController {
  constructor(private readonly systemLogsService: SystemLogsService) {}

  @Get()
  async findAll(@Query() query: any) {
    const result = await this.systemLogsService.findAll(query);
    return { data: result };
  }
}
