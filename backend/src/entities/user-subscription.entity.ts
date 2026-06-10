import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('user_subscriptions')
@Index(['userId'])
@Index(['subscriptionPlanId'])
@Index(['expiresAt'])
export class UserSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column()
  userId: string = "";

  @Column()
  subscriptionPlanId: string = "";

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePaid: number = 0;

  @Column()
  status: string = "";

  @Column({ nullable: true })
  expiresAt: Date = new Date();

  @Column({ type: 'bigint', default: '0' })
  trafficUsed: number = 0;

  @Column({ type: 'bigint', default: '0' })
  trafficLimit: number = 0;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();

  @ManyToOne(() => User, user => user.subscriptions)
  user: User | null;

  @ManyToOne(() => SubscriptionPlan, plan => plan.subscriptions)
  subscriptionPlan: SubscriptionPlan | null;
}