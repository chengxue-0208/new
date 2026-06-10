import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Node } from './node.entity';
import { VpnConfiguration } from './vpn-config.entity';
import { Order } from './order.entity';
import { UserSubscription } from './user-subscription.entity';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['subscriptionStatus', 'subscriptionExpiresAt'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column()
  email: string = "";

  @Column()
  passwordHash: string = "";

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number = 0;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
    default: 'ACTIVE'
  })
  subscriptionStatus: string = "";

  @Column({ nullable: true })
  subscriptionPlanId: string = "";

  @Column({ nullable: true })
  subscriptionExpiresAt: Date = new Date();

  @Column({ type: 'integer', default: 0 })
  trafficUsed: number = 0;

  @Column({ type: 'bigint', default: '0' })
  trafficLimit: number = 0;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();

  @OneToMany(() => Node, node => node.user)
  nodes: Node[];

  @OneToMany(() => VpnConfiguration, config => config.user)
  connections: VpnConfiguration[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => UserSubscription, subscription => subscription.user)
  subscriptions: UserSubscription[];
}