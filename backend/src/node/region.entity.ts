import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Node } from './node.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  countryCode: string;

  @Column()
  city: string;

  @Column({ default: 'asia' })
  continent: string;

  @Column({ default: 'public' })
  networkType: 'public' | 'private';

  @Column({ default: 'tcp' })
  protocol: 'tcp' | 'udp';

  @Column({ default: 0 })
  maxUsers: number;

  @Column({ default: 0 })
  currentUsers: number;

  @OneToMany(() => Node, (node) => node.regionEntity)
  nodes: Node[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}