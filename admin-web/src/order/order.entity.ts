import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  subscriptionPlanId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

  @Column()
  paymentMethod: string;

  @Column()
  transactionId?: string;

  @Column()
  ipAddress: string;

  @Column('text')
  metadata?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}