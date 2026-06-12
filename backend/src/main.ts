import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { runSeed } from './seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);

  if (process.env.NODE_ENV === 'development') {
    const configService = app.get(ConfigService);
    const dataSource = new DataSource({
      type: 'postgres',
      url: configService.get('DATABASE_URL'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    });

    if (await dataSource.initialize()) {
      await runSeed(dataSource);
    }
  }
}
bootstrap();