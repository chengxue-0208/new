import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from '../entities/node.entity';

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
  ) {}

  async findAll(): Promise<Node[]> {
    return this.nodeRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Node> {
    const node = await this.nodeRepository.findOne({ where: { id } });
    if (!node) {
      throw new Error('Node not found');
    }
    return node;
  }

  async create(nodeData: Node): Promise<Node> {
    const node = this.nodeRepository.create(nodeData);
    return this.nodeRepository.save(node);
  }

  async update(id: string, nodeData: any): Promise<Node> {
    await this.nodeRepository.update(id, nodeData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.nodeRepository.delete(id);
  }
}