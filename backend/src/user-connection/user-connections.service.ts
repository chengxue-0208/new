import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConnection } from './user-connection.entity';
import { LessThan } from 'typeorm';

@Injectable()
export class UserConnectionsService {
  constructor(
    @InjectRepository(UserConnection)
    private connectionRepository: Repository<UserConnection>,
  ) {}

  async create(connectionData: Partial<UserConnection>): Promise<UserConnection> {
    const connection = this.connectionRepository.create(connectionData);
    return this.connectionRepository.save(connection);
  }

  async findAll(): Promise<UserConnection[]> {
    return this.connectionRepository.find({
      relations: ['user', 'node'],
      order: {
        createdAt: 'DESC',
      }
    });
  }

  async findOne(id: string): Promise<UserConnection> {
    const connection = await this.connectionRepository.findOne({
      where: { id },
      relations: ['user', 'node'],
    });
    if (!connection) {
      throw new NotFoundException('Connection not found');
    }
    return connection;
  }

  async update(id: string, connectionData: Partial<UserConnection>): Promise<UserConnection> {
    await this.connectionRepository.update(id, connectionData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.connectionRepository.delete(id);
  }

  async findByUser(userId: string): Promise<UserConnection[]> {
    return this.connectionRepository.find({
      where: { userId },
      relations: ['node'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByNode(nodeId: string): Promise<UserConnection[]> {
    return this.connectionRepository.find({
      where: { nodeId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findActive(): Promise<UserConnection[]> {
    return this.connectionRepository.find({
      where: { status: 'active' },
      relations: ['user', 'node'],
      order: { createdAt: 'DESC' }
    });
  }

  async findDisconnected(): Promise<UserConnection[]> {
    return this.connectionRepository.find({
      where: { status: 'disconnected' },
      relations: ['user', 'node'],
      order: { updatedAt: 'DESC' }
    });
  }

  async clearOldConnections(): Promise<any> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    await this.connectionRepository.delete({
      status: 'disconnected',
      updatedAt: LessThan(cutoffDate),
    });
    return { message: 'Old connections cleared' };
  }
}