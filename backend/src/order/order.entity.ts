import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { SubscriptionPlan } from '../subscription-plan/subscription-plan.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum OrderPaymentMethod {
  WALLET = 'WALLET',
  CREDIT_CARD = 'CREDIT_CARD',
  ALIPAY = 'ALIPAY',
  WECHAT_PAY = 'WECHAT_PAY',
  OTHER = 'OTHER',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  orderId: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ type: 'enum', enum: OrderPaymentMethod })
  paymentMethod: OrderPaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  paidAmount?: number;

  @Column({ type: 'int', default: 0 })
  discountAmount: number;

  @Column({ type: 'int', default: 0 })
  refundAmount: number;

  @Column({ type: 'int', default: 0 })
  pointsUsed: number;

  @Column({ type: 'int', default: 0 })
  pointsEarned: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: 'subscriptionPlanId' })
  subscriptionPlan: SubscriptionPlan;

  @Column({ type: 'timestamp', nullable: true })
  paymentTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  refundTime?: Date;

  @Column({ type: 'json', nullable: true })
  paymentDetails?: any;

  @Column({ type: 'text', nullable: true })
  transactionId?: string;

  @Column({ type: 'text', nullable: true })
  transactionNote?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}