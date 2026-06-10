import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';
import { Node } from './node.entity';

@Entity('connection_logs')
@Index(['userId'])
@Index(['nodeId'])
export class ConnectionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column({ type: 'uuid', nullable: false })
  userId: string = "";

  @Column({ type: 'uuid', nullable: false })
  nodeId: string = "";

  @Column({ type: 'timestamp', nullable: false })
  connectAt: Date = new Date();

  @Column({ type: 'timestamp', nullable: true })
  disconnectAt: Date = new Date();

  @Column({ type: 'integer', default: 0 })
  duration: number = 0;

  @Column({ type: 'bigint', default: '0' })
  traffic: number = 0;

  @Column({ type: 'enum', enum: ['connected', 'disconnected', 'failed'], default: 'connected' })
  status: string = "";

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();

  @ManyToOne(() => User, user => user.connections)
  user: User | null;

  @ManyToOne(() => Node, node => node.configurations)
  node: Node | null;
}