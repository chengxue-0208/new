import { Repository } from 'typeorm';
import { SystemLog } from './system-log.entity';
import { SystemLogsService } from './system-logs.service';

describe('SystemLogsService', () => {
  let service: SystemLogsService;
  let logRepository: Pick<Repository<SystemLog>, 'createQueryBuilder'>;
  let queryBuilder: any;

  beforeEach(() => {
    queryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    logRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    service = new SystemLogsService(logRepository as Repository<SystemLog>);
  });

  describe('findAll', () => {
    it('ignores undefined string date filters from query params', async () => {
      await expect(
        service.findAll({
          page: '1',
          limit: '10',
          search: '',
          level: 'all',
          dateFrom: 'undefined',
          dateTo: 'undefined',
        }),
      ).resolves.toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
    });
  });
});
