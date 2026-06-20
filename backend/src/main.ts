import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { getAppPort } from './config/app.config';
import { runStartupSeed } from './database/startup-seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const port = getAppPort(configService);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);

  await runStartupSeed(app);
}
bootstrap();
