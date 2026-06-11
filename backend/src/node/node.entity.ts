import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { VPNConfiguration } from '../vpn/vpn-configuration.entity';
import { UserConnection } from './user-connection.entity';
import { Region } from './region.entity';

@Entity()
export class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  region: string;

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  port?: number;

  @Column({ nullable: true })
  serverAddress?: string;

  @Column({ nullable: true })
  serverPort?: number;

  @Column({ default: 'online' })
  status: 'online' | 'offline' | 'maintenance';

  @Column({ nullable: true })
  statusMessage?: string;

  @Column({ type: 'bigint', default: 0 })
  uptime: number;

  @Column({ type: 'int', default: 0 })
  maxConnections: number;

  @Column({ type: 'int', default: 0 })
  currentConnections: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  load: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bandwidth: number;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'regionId' })
  regionEntity: Region;

  @OneToMany(() => VPNConfiguration, (config) => config.node)
  configs: VPNConfiguration[];

  @OneToMany(() => UserConnection, (connection) => connection.node)
  connections: UserConnection[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}