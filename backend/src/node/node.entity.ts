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
import { UserConnection } from '../user/user-connection.entity';
import { Region } from './region.entity';

export type NodeProtocol = 'vless' | 'vmess' | 'trojan' | 'shadowsocks';
export type NodeSecurity = 'reality' | 'tls' | 'none';
export type NodeType = 'tcp' | 'ws' | 'grpc';

@Entity('node')
export class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  region: string;

  @Column({ default: 'vless' })
  protocol: NodeProtocol;

  @Column({ default: '' })
  address: string;

  @Column({ type: 'int' })
  port: number;

  @Column({ default: '' })
  uuid: string;

  @Column({ default: 'tls' })
  security: NodeSecurity;

  @Column({ nullable: true })
  sni?: string;

  @Column({ default: 'none' })
  encryption: string;

  @Column({ nullable: true })
  fp?: string;

  @Column({ default: 'ws' })
  type: NodeType;

  @Column({ nullable: true })
  host?: string;

  @Column({ nullable: true })
  path?: string;

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

  @Column({ type: 'int', default: 0 })
  delay: number;

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
