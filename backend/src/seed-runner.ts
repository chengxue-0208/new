import { ConfigService } from '@nestjs/config';
import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { createDatabaseOptions } from './config/database.config';
import { runSeed } from './seed';

async function runSeedScript() {
  loadEnv();

  const configService = new ConfigService(process.env);
  const dataSource = new DataSource(createDatabaseOptions(configService, {
    synchronize: false,
    logging: false,
  }) as DataSourceOptions);

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    await runSeed(dataSource);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

runSeedScript();
