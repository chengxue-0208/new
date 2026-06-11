import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../user/user.controller';
import { UsersService } from '../user/user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getSubscriptionStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call usersService.findAll', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'test@example.com',
          subscriptionStatus: 'ACTIVE',
          balance: 100,
          trafficUsed: 1024,
          trafficLimit: 10240,
          createdAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers as any);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getSubscriptionStatus', () => {
    it('should call usersService.getSubscriptionStatus', async () => {
      const mockResponse = {
        userId: '1',
        email: 'test@example.com',
        status: 'ACTIVE',
        expiresAt: new Date(),
        balance: 100,
        trafficUsed: 1024,
        trafficLimit: 10240,
      };
      jest.spyOn(service, 'getSubscriptionStatus').mockResolvedValue(mockResponse as any);

      const result = await controller.getUserSubscription('1');

      expect(service.getSubscriptionStatus).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOne', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        subscriptionStatus: 'ACTIVE',
        balance: 100,
        trafficUsed: 1024,
        trafficLimit: 10240,
        createdAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as any);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should call usersService.update', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        subscriptionStatus: 'ACTIVE',
        balance: 200,
        trafficUsed: 2048,
        trafficLimit: 10240,
        createdAt: new Date(),
      };
      const updateData = { balance: 200 };
      jest.spyOn(service, 'update').mockResolvedValue(mockUser as any);

      const result = await controller.update('1', updateData);

      expect(service.update).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('search', () => {
    it('should call usersService.findByEmail', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        subscriptionStatus: 'ACTIVE',
        balance: 100,
        trafficUsed: 1024,
        trafficLimit: 10240,
      };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser as any);

      const result = await controller.search('test@example.com');

      expect(service.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });
});