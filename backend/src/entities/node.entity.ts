import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { VpnConfiguration } from './vpn-config.entity';

@Entity('nodes')
@Index(['status'])
@Index(['region'])
@Index(['delay'])
export class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column()
  name: string = "";

  @Column()
  region: string = "";

  @Column()
  protocol: string = "";

  @Column()
  address: string = "";

  @Column()
  port: number = 0;

  @Column({ nullable: true })
  path: string = "";

  @Column({ nullable: true })
  serverName: string = "";

  @Column({ default: 0 })
  delay: number = 0;

  @Column({
    type: 'enum',
    enum: ['online', 'offline'],
    default: 'online'
  })
  status: string = "";

  @Column({ default: false })
  isFree: boolean = false;

  @ManyToOne(() => User, user => user.nodes)
  user: User | null = null;

  @OneToMany(() => VpnConfiguration, config => config.node)
  configurations: VpnConfiguration[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();
}