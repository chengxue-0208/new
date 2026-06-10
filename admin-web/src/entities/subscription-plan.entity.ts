import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserSubscription } from './user-subscription.entity';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column()
  name: string = "";

  @Column()
  durationDays: number = 0;

  @Column()
  monthlyTraffic: number = 0;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number = 0;

  @Column({ default: true })
  isActive: boolean = true;

  @Column({ default: 0 })
  displayOrder: number = 0;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();

  @OneToMany(() => UserSubscription, subscription => subscription.subscriptionPlan)
  subscriptions: UserSubscription[];
}