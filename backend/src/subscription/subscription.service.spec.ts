import { Repository } from 'typeorm';
import { Node } from '../node/node.entity';
import { User, SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';
import { UserSubscription } from '../user-subscription/user-subscription.entity';
import { SubscriptionService } from './subscription.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let userRepository: Pick<Repository<User>, 'findOne' | 'update'>;
  let planRepository: Pick<Repository<SubscriptionPlan>, 'findOne'>;
  let subscriptionRepository: any;
  let nodeRepository: Pick<Repository<Node>, 'find'>;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };
    planRepository = {
      findOne: jest.fn(),
    };
    subscriptionRepository = {
      create: jest.fn((data) => data as UserSubscription),
      save: jest.fn((data) => Promise.resolve({ id: 'subscription-1', ...data } as UserSubscription)),
      update: jest.fn(),
    };
    nodeRepository = {
      find: jest.fn(),
    };

    service = new SubscriptionService(
      userRepository as Repository<User>,
      planRepository as Repository<SubscriptionPlan>,
      subscriptionRepository as Repository<UserSubscription>,
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

  describe('getMySubscription', () => {
    it('reports an active user as expired when the expiration time has passed', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: 'user-1',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: new Date('2020-01-01T00:00:00.000Z'),
        trafficUsed: 100,
        trafficLimit: 1000,
      } as User);

      await expect(service.getMySubscription('user-1')).resolves.toMatchObject({
        subscriptionStatus: 'EXPIRED',
        trafficUsed: 100,
        trafficLimit: 1000,
      });
    });
  });

  describe('purchase', () => {
    it('creates an active subscription and extends from the current expiration date', async () => {
      const currentExpiresAt = new Date('2030-01-01T00:00:00.000Z');
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        id: 'user-1',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: currentExpiresAt,
        trafficUsed: 500,
        trafficLimit: 1000,
      } as User);
      jest.spyOn(planRepository, 'findOne').mockResolvedValue({
        id: 'plan-1',
        name: 'Monthly',
        durationDays: 30,
        trafficLimit: 2048,
        price: 19.99,
      } as SubscriptionPlan);

      const result = await service.purchase({ planId: 'plan-1' }, 'user-1');

      expect(result).toMatchObject({
        id: 'subscription-1',
        userId: 'user-1',
        planId: 'plan-1',
        trafficLimit: 2048,
        status: 'ACTIVE',
      });
      expect(result.endAt).toEqual(new Date('2030-01-31T00:00:00.000Z'));
      expect(subscriptionRepository.update).toHaveBeenCalledWith(
        { userId: 'user-1', status: 'ACTIVE' },
        expect.objectContaining({ status: 'INACTIVE' }),
      );
      expect(subscriptionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          subscriptionPlanId: 'plan-1',
          status: 'ACTIVE',
          trafficUsed: 0,
          trafficLimit: 2048,
          totalCost: 19.99,
        }),
      );
      expect(userRepository.update).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({
          subscriptionPlanId: 'plan-1',
          subscriptionStatus: 'ACTIVE',
          trafficUsed: 0,
          trafficLimit: 2048,
        }),
      );
    });
  });
});
