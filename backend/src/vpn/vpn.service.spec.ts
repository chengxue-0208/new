import { Repository } from 'typeorm';
import { ConnectionLog } from '../connection-log/connection-log.entity';
import { Node } from '../node/node.entity';
import { User, VPNConfiguration } from '../user/user.entity';
import { VpnService } from './vpn.service';

describe('VpnService', () => {
  let service: VpnService;
  let userRepository: Pick<Repository<User>, 'findOne' | 'update'>;
  let nodeRepository: Pick<Repository<Node>, 'findOne'>;
  let vpnConfigRepository: any;
  let connectionLogRepository: any;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };
    nodeRepository = {
      findOne: jest.fn(),
    };
    vpnConfigRepository = {
      create: jest.fn((data) => data as VPNConfiguration),
      save: jest.fn((data) => Promise.resolve(data as VPNConfiguration)),
      findOne: jest.fn(),
      delete: jest.fn(),
    };
    connectionLogRepository = {
      create: jest.fn((data) => data as ConnectionLog),
      save: jest.fn((data) => Promise.resolve(data as ConnectionLog)),
    };

    service = new VpnService(
      userRepository as Repository<User>,
      nodeRepository as Repository<Node>,
      vpnConfigRepository as Repository<VPNConfiguration>,
      connectionLogRepository as Repository<ConnectionLog>,
    );
  });

  describe('connect', () => {
    it('rejects active users whose subscription has expired', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: 'user-1',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: new Date('2020-01-01T00:00:00.000Z'),
        trafficUsed: 0,
        trafficLimit: 1000,
      } as User);

      await expect(service.connect('user-1', { nodeId: 'node-1' })).rejects.toThrow('Subscription expired');

      expect(userRepository.update).toHaveBeenCalledWith('user-1', { subscriptionStatus: 'EXPIRED' });
      expect(nodeRepository.findOne).not.toHaveBeenCalled();
    });

    it('rejects users who have reached their traffic limit', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: 'user-1',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: new Date('2030-01-01T00:00:00.000Z'),
        trafficUsed: 1000,
        trafficLimit: 1000,
      } as User);

      await expect(service.connect('user-1', { nodeId: 'node-1' })).rejects.toThrow('Traffic limit exceeded');

      expect(nodeRepository.findOne).not.toHaveBeenCalled();
    });
  });
});
