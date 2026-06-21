import { Repository } from 'typeorm';
import { Node } from '../node/node.entity';
import { User, SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let nodeRepository: Pick<Repository<Node>, 'find'>;

  beforeEach(() => {
    nodeRepository = {
      find: jest.fn(),
    };

    service = new SubscriptionService(
      {} as Repository<User>,
      {} as Repository<SubscriptionPlan>,
      nodeRepository as Repository<Node>,
    );
  });

  describe('getSubscribeText', () => {
    it('formats online nodes as text/plain subscription lines', async () => {
      jest.spyOn(nodeRepository, 'find').mockResolvedValue([
        {
          name: 'cfnode',
          protocol: 'vless',
          uuid: 'ed1e0621-5024-4de9-8673-d8bc2a4fd197',
          address: '91.193.58.186',
          port: 8443,
          encryption: 'none',
          security: 'tls',
          sni: 'network.chengxue.dpdns.org',
          fp: 'chrome',
          type: 'ws',
          host: 'network.chengxue.dpdns.org',
          path: '%2Fproxyip%3D156.154.245.83',
          status: 'online',
        } as Node,
      ]);

      await expect(service.getSubscribeText()).resolves.toBe(
        'vless://ed1e0621-5024-4de9-8673-d8bc2a4fd197@91.193.58.186:8443?encryption=none&security=tls&sni=network.chengxue.dpdns.org&fp=chrome&type=ws&host=network.chengxue.dpdns.org&path=%2Fproxyip%3D156.154.245.83#cfnode',
      );

      expect(nodeRepository.find).toHaveBeenCalledWith({
        where: { status: 'online' },
        order: {
          region: 'ASC',
          name: 'ASC',
        },
      });
    });
  });
});
