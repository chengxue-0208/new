import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from './node.entity';

@Injectable()
export class DelayService {
  private readonly logger = new Logger(DelayService.name);

  constructor(
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
  ) {}

  async checkNodeDelay(nodeId: string): Promise<number> {
    const node = await this.nodeRepository.findOne({ where: { id: nodeId } });

    if (!node) {
      throw new Error('Node not found');
    }

    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`https://${node.server}`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const endTime = Date.now();
      const delay = endTime - startTime;

      this.logger.debug(`Node ${node.name} delay: ${delay}ms`);

      await this.nodeRepository.update(nodeId, { delay });

      return delay;
    } catch (error: any) {
      this.logger.warn(`Node ${node.name} delay check failed: ${error.message}`);
      await this.nodeRepository.update(nodeId, { delay: -1 });
      return -1;
    }
  }

  async checkAllNodesDelay(): Promise<any[]> {
    const nodes = await this.nodeRepository.find();

    const delayResults = await Promise.all(
      nodes.map(async (node) => {
        const delay = await this.checkNodeDelay(node.id);
        return { ...node, delay };
      }),
    );

    return delayResults;
  }

  async updateNodeDelay(nodeId: string): Promise<number> {
    return this.checkNodeDelay(nodeId);
  }

  async getDelayStats(): Promise<{ total: number; online: number; offline: number; avgDelay: number }> {
    const nodes = await this.nodeRepository.find();
    const onlineNodes = nodes.filter(node => node.status === 'online');
    
    const onlineDelays = onlineNodes
      .filter(node => node.delay > 0)
      .map(node => node.delay);
    
    const total = onlineNodes.length;
    const online = onlineDelays.length;
    const offline = total - online;
    const avgDelay = onlineDelays.length > 0 
      ? Math.round(onlineDelays.reduce((a, b) => a + b, 0) / onlineDelays.length)
      : 0;

    return {
      total,
      online,
      offline,
      avgDelay,
    };
  }
}
