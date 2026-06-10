import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Node } from '../entities/node.entity';
import { VpnConfiguration } from '../entities/vpn-config.entity';
import { Order } from '../entities/order.entity';
import { UserSubscription } from '../entities/user-subscription.entity';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['subscriptionStatus', 'subscriptionExpiresAt'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0' })
  balance: number;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
    default: 'ACTIVE'
  })
  subscriptionStatus: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subscriptionPlanId: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  subscriptionExpiresAt: Date;

  @Column({ type: 'integer', default: 0 })
  trafficUsed: number;

  @Column({ type: 'bigint', default: '0' })
  trafficLimit: number;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Node, node => node.user)
  nodes: Node[];

  @OneToMany(() => VpnConfiguration, config => config.user)
  connections: VpnConfiguration[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => UserSubscription, subscription => subscription.user)
  subscriptions: UserSubscription[];
}