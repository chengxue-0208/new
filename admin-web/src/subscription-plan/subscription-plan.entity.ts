import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  displayName: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discountPrice?: number;

  @Column('integer')
  durationDays: number;

  @Column('integer')
  trafficLimitGB: number;

  @Column('integer')
  serverCount: number;

  @Column('integer')
  maxConnections: number;

  @Column('text')
  features: string;

  @Column('text')
  allowedCountries?: string;

  @Column('text')
  excludedCountries?: string;

  @Column()
  status: 'ACTIVE' | 'INACTIVE' | 'COMING_SOON';

  @Column('integer')
  displayOrder: number;

  @Column('boolean')
  popular: boolean;

  @Column('text')
  bannerImage?: string;

  @Column('text')
  featuresImage?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}