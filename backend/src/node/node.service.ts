import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from './node.entity';
import { VPNConfiguration } from '../vpn/vpn-configuration.entity';
import { UserConnection } from '../user/user-connection.entity';

@Injectable()
export class NodesService {
  constructor(
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
  ) {}

  async create(nodeData: Partial<Node>): Promise<Node> {
    const node = this.nodeRepository.create(nodeData);
    return this.nodeRepository.save(node);
  }

  async findAll(): Promise<Node[]> {
    return this.nodeRepository.find({
      relations: ['configs', 'connections'],
      order: {
        createdAt: 'DESC',
        region: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<Node> {
    const node = await this.nodeRepository.findOne({
      where: { id },
      relations: ['configs', 'connections'],
    });
    if (!node) {
      throw new NotFoundException('Node not found');
    }
    return node;
  }

  async update(id: string, nodeData: Partial<Node>): Promise<Node> {
    await this.nodeRepository.update(id, nodeData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.nodeRepository.delete(id);
  }

  async findByRegion(region: string): Promise<Node[]> {
    return this.nodeRepository.find({
      where: { region },
      relations: ['configs'],
      order: { name: 'ASC' }
    });
  }

  async checkHealth(): Promise<any> {
    const nodes = await this.findAll();
    return {
      total: nodes.length,
      online: nodes.filter(n => n.status === 'online').length,
      offline: nodes.filter(n => n.status === 'offline').length,
      nodes: nodes.map(node => ({
        id: node.id,
        name: node.name,
        region: node.region,
        status: node.status,
        statusMessage: node.statusMessage,
        uptime: node.uptime,
      }))
    };
  }
}