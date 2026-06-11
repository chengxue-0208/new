import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Node } from './node.entity';

@Entity()
export class UserConnection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  nodeId: string;

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  vpnIp?: string;

  @Column({ nullable: true })
  vpnPort?: number;

  @Column({ default: 'active' })
  status: 'active' | 'disconnected' | 'error' | 'pending';

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ nullable: true })
  disconnectReason?: string;

  @Column({ type: 'int', default: 0 })
  reconnectCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bandwidthIn: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bandwidthOut: number;

  @Column({ type: 'int', default: 0 })
  connectionDuration: number;

  @Column({ nullable: true })
  disconnectTime?: Date;

  @Column({ default: 'tcp' })
  protocol: 'tcp' | 'udp';

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Node)
  @JoinColumn({ name: 'nodeId' })
  node: Node;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}