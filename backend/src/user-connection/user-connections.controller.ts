import { Controller, Get, Post, Delete, Param, UseGuards, Query } from '@nestjs/common';
import { UserConnectionsService } from './user-connections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-connections')
@UseGuards(JwtAuthGuard)
export class UserConnectionsController {
  constructor(private readonly userConnectionsService: UserConnectionsService) {}

  @Get()
  async findAll() {
    return this.userConnectionsService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.userConnectionsService.findByUser(userId);
  }

  @Get('node/:nodeId')
  async findByNode(@Param('nodeId') nodeId: string) {
    return this.userConnectionsService.findByNode(nodeId);
  }

  @Get('active')
  async findActive() {
    return this.userConnectionsService.findActive();
  }

  @Get('disconnected')
  async findDisconnected() {
    return this.userConnectionsService.findDisconnected();
  }

  @Delete('clear')
  async clearOldConnections() {
    return this.userConnectionsService.clearOldConnections();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userConnectionsService.remove(id);
  }
}