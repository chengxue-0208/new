import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum LogSource {
  USER_SERVICE = 'USER_SERVICE',
  NODE_SERVICE = 'NODE_SERVICE',
  VPN_SERVICE = 'VPN_SERVICE',
  PAYMENT_SERVICE = 'PAYMENT_SERVICE',
  SUBSCRIPTION_SERVICE = 'SUBSCRIPTION_SERVICE',
  SYSTEM = 'SYSTEM',
}

@Entity()
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LogLevel })
  level: LogLevel;

  @Column({ type: 'enum', enum: LogSource })
  source: LogSource;

  @Column()
  message: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  nodeId?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: any;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ type: 'int', default: 0 })
  responseTime: number;

  @Column({ type: 'json', nullable: true })
  stackTrace?: any;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}