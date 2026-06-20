import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getBooleanConfig, isDevelopment } from './app.config';

export function createDatabaseOptions(
  configService: ConfigService,
  overrides: Partial<TypeOrmModuleOptions> = {},
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: configService.getOrThrow<string>('DATABASE_URL'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: getBooleanConfig(configService, 'DB_SYNCHRONIZE', true),
    logging: getBooleanConfig(configService, 'DB_LOGGING', isDevelopment(configService)),
    ...overrides,
  } as TypeOrmModuleOptions;
}
