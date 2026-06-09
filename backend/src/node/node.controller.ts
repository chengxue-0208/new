import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { NodeService } from './node.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('nodes')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get()
  async findAll() {
    return this.nodeService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() nodeData: any) {
    return this.nodeService.create(nodeData);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.nodeService.findOne(id);
  }
}