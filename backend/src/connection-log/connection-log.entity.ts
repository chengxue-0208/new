import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ConnectionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  nodeId: string;

  @Column({ type: 'timestamp' })
  connectAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  disconnectAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ip?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  protocol?: string;

  @Column({ type: 'int', nullable: true })
  duration?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}