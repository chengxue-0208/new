import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VPNConfiguration } from './vpn-config.entity';
import { Node } from '../node/node.entity';

@Injectable()
export class VPNConfigurationsService {
  constructor(
    @InjectRepository(VPNConfiguration)
    private configRepository: Repository<VPNConfiguration>,
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
  ) {}

  async create(configData: Partial<VPNConfiguration>): Promise<VPNConfiguration> {
    const config = this.configRepository.create(configData);
    return this.configRepository.save(config);
  }

  async findAll(): Promise<VPNConfiguration[]> {
    return this.configRepository.find({
      relations: ['node'],
      order: {
        name: 'ASC',
        port: 'ASC',
      }
    });
  }

  async findOne(id: string): Promise<VPNConfiguration> {
    const config = await this.configRepository.findOne({
      where: { id },
      relations: ['node'],
    });
    if (!config) {
      throw new NotFoundException('VPN configuration not found');
    }
    return config;
  }

  async update(id: string, configData: Partial<VPNConfiguration>): Promise<VPNConfiguration> {
    await this.configRepository.update(id, configData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.configRepository.delete(id);
  }

  async findByNodeId(nodeId: string): Promise<VPNConfiguration[]> {
    return this.configRepository.find({
      where: { nodeId },
      order: { name: 'ASC' }
    });
  }

  async findByProtocol(protocol: string): Promise<VPNConfiguration[]> {
    return this.configRepository.find({
      where: { protocol },
      relations: ['node'],
      order: { port: 'ASC' }
    });
  }
}