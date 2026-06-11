import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Node } from './node.entity';
import { UserConnection } from './user-connection.entity';

@Entity()
export class VPNConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  nodeId: string;

  @Column()
  protocol: 'tcp' | 'udp';

  @Column()
  port: number;

  @Column({ nullable: true })
  dns?: string;

  @Column({ nullable: true })
  encryption?: string;

  @Column({ nullable: true })
  compression?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bandwidth: number;

  @Column({ type: 'int', default: 0 })
  maxConnections: number;

  @Column({ type: 'int', default: 0 })
  currentConnections: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  statusMessage?: string;

  @Column({ type: 'json', nullable: true })
  settings?: any;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Node, (node) => node.configs)
  @JoinColumn({ name: 'nodeId' })
  node: Node;

  @OneToMany(() => UserConnection, (connection) => connection.config)
  connections: UserConnection[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}