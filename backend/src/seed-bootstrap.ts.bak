import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource, createConnection } from 'typeorm';
import { seedDatabase } from './seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'admin1234',
    database: 'vpn_db',
    entities: [
      './src/entities/**/*.entity.ts',
    ],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    // Check if tables exist, if not create them and seed
    await dataSource.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name IN ('users', 'nodes', 'subscription_plans', 'orders', 'connection_logs', 'system_logs')
    `);

    const tables = await dataSource.query('SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = \'public\';');
    const tableCount = tables[0].count;

    if (tableCount === 0) {
      console.log('🚀 Creating tables...');
      await dataSource.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          balance DECIMAL(10,2) DEFAULT 0,
          subscription_status VARCHAR(50) DEFAULT 'ACTIVE',
          subscription_plan_id UUID,
          subscription_expires_at TIMESTAMP,
          traffic_used BIGINT DEFAULT 0,
          traffic_limit BIGINT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await dataSource.query(`
        CREATE TABLE nodes (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          region VARCHAR(100) NOT NULL,
          protocol VARCHAR(50) NOT NULL,
          address VARCHAR(255) NOT NULL,
          port INT NOT NULL,
          path VARCHAR(255),
          server_name VARCHAR(255),
          delay INT DEFAULT 0,
          status VARCHAR(20) DEFAULT 'online',
          is_free BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await dataSource.query(`
        CREATE TABLE subscription_plans (
          id UUID PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          duration_days INT NOT NULL,
          monthly_traffic BIGINT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          is_active BOOLEAN DEFAULT true,
          display_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await dataSource.query(`
        CREATE TABLE orders (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL,
          plan_id UUID NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          payment_method VARCHAR(50),
          status VARCHAR(50) DEFAULT 'PENDING',
          pay_url VARCHAR(500),
          payment_transaction_id VARCHAR(255),
          paid_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await dataSource.query(`
        CREATE TABLE connection_logs (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL,
          node_id UUID NOT NULL,
          connect_at TIMESTAMP NOT NULL,
          disconnect_at TIMESTAMP,
          duration INT DEFAULT 0,
          traffic BIGINT DEFAULT 0,
          status VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await dataSource.query(`
        CREATE TABLE system_logs (
          id UUID PRIMARY KEY,
          level VARCHAR(20) DEFAULT 'info',
          message TEXT NOT NULL,
          error_code VARCHAR(100),
          user_id UUID,
          ip_address VARCHAR(45),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log('✅ Tables created');

      // Seed data
      await seedDatabase(dataSource);
    } else {
      console.log('✅ Database already contains data');
    }

    // Start application
    await app.listen(3000);
    console.log('🚀 Server is running on http://localhost:3000');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

bootstrap();