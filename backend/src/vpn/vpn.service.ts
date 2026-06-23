import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Node, VPNConfiguration } from '../user/user.entity';
import { ConnectionLog } from '../connection-log/connection-log.entity';

@Injectable()
export class VpnService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
    @InjectRepository(VPNConfiguration)
    private vpnConfigRepository: Repository<VPNConfiguration>,
    @InjectRepository(ConnectionLog)
    private connectionLogRepository: Repository<ConnectionLog>,
  ) {}

  async connect(userId: string, connectionData: any): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Subscription expired');
    }

    const now = new Date();
    if (user.subscriptionStatus !== 'ACTIVE' || (user.subscriptionExpiresAt && user.subscriptionExpiresAt <= now)) {
      if (user.subscriptionStatus === 'ACTIVE') {
        await this.userRepository.update(userId, { subscriptionStatus: 'EXPIRED' });
      }
      throw new Error('Subscription expired');
    }

    const trafficUsed = Number(user.trafficUsed || 0);
    const trafficLimit = Number(user.trafficLimit || 0);
    if (trafficLimit > 0 && trafficUsed >= trafficLimit) {
      throw new Error('Traffic limit exceeded');
    }

    const node = await this.nodeRepository.findOne({
      where: { id: connectionData.nodeId },
    });

    if (!node || node.status !== 'online') {
      throw new Error('Node unavailable');
    }

    const config = this.vpnConfigRepository.create({
      nodeId: node.id,
      protocol: node.type === 'tcp' ? 'tcp' : 'udp',
      port: node.port,
      createdAt: new Date(),
    });

    await this.vpnConfigRepository.save(config);

    const log = this.connectionLogRepository.create({
      userId,
      nodeId: node.id,
      connectAt: new Date(),
      status: 'connected',
    });
    await this.connectionLogRepository.save(log);

    await this.userRepository.update(userId, {
      trafficUsed: (user.trafficUsed || 0) + 1024 * 1024 * 10,
    });

    return config;
  }

  async disconnect(userId: string): Promise<any> {
    const config = await this.vpnConfigRepository.findOne({
      where: { node: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    if (!config) {
      throw new Error('No active connection');
    }

    const log = this.connectionLogRepository.create({
      userId,
      nodeId: config.nodeId,
      connectAt: config.createdAt,
      disconnectAt: new Date(),
      status: 'disconnected',
    });
    await this.connectionLogRepository.save(log);

    await this.vpnConfigRepository.delete(config.id);

    return { message: 'Disconnected' };
  }

  async getStatus(userId: string): Promise<any> {
    const config = await this.vpnConfigRepository.findOne({
      where: { node: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    if (!config) {
      return { connected: false };
    }

    const node = await this.nodeRepository.findOne({
      where: { id: config.nodeId },
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    return {
      connected: true,
      node,
      trafficUsed: user?.trafficUsed || 0,
    };
  }

  async getConfig(userId: string): Promise<any> {
    return this.getStatus(userId);
  }
}
