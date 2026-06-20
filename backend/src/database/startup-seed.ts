import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { isDevelopment } from '../config/app.config';
import { runSeed } from '../seed';

export async function runStartupSeed(app: INestApplication): Promise<void> {
  const configService = app.get(ConfigService);

  if (!isDevelopment(configService)) {
    return;
  }

  try {
    await runSeed(app.get(DataSource));
  } catch (error) {
    console.error('Database seed failed; continuing to run application.', error);
  }
}
