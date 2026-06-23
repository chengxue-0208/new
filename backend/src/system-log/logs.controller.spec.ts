import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from './logs.controller';
import { LogSource } from './system-log.entity';
import { SystemLogsService } from './system-logs.service';

describe('LogsController', () => {
  let controller: LogsController;
  let service: Pick<SystemLogsService, 'findAll'>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [
        {
          provide: SystemLogsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LogsController>(LogsController);
    service = module.get(SystemLogsService);
  });

  describe('findAll', () => {
    it('returns the paginated log response without wrapping it again', async () => {
      const response = {
        data: [
          {
            id: 'log-1',
            level: 'info',
            message: 'User logged in',
            ip: '127.0.0.1',
            timestamp: new Date('2026-06-21T00:00:00.000Z'),
            source: LogSource.SYSTEM,
            userId: undefined,
            nodeId: undefined,
            responseTime: 0,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      };
      const query = { page: '1', limit: '10' };

      jest.spyOn(service, 'findAll').mockResolvedValue(response);

      await expect(controller.findAll(query)).resolves.toEqual(response);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });
});
