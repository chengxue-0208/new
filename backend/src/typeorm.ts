import { ConfigService } from '@nestjs/config';
import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { createDatabaseOptions } from './config/database.config';

loadEnv();

const configService = new ConfigService(process.env);
const dataSourceOptions = createDatabaseOptions(configService, {
  synchronize: false,
  logging: false,
}) as DataSourceOptions;

export const dataSource = new DataSource(dataSourceOptions);
