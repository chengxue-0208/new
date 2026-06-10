import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column()
  userId: string = "";

  @Column()
  planId: string = "";

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number = 0;

  @Column()
  paymentMethod: string = "";

  @Column({
    type: 'enum',
    enum: ['PENDING', 'PAID', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  })
  status: string = "";

  @Column({ nullable: true })
  payUrl: string = "";

  @Column({ nullable: true })
  paymentTransactionId: string = "";

  @Column({ nullable: true })
  paidAt: Date = new Date();

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();

@ManyToOne(() => User, user => user.orders)
  user: User | null;

  @ManyToOne(() => SubscriptionPlan, plan => plan.subscriptions)
  plan: SubscriptionPlan | null;
}