import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';
import { Node } from './node.entity';

@Entity('vpn_configurations')
@Index(['userId'])
@Index(['nodeId'])
export class VpnConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column()
  userId: string = "";

  @Column()
  nodeId: string = "";

  @Column()
  protocol: string = "";

  @Column()
  address: string = "";

  @Column()
  port: number = 0;

  @Column()
  path: string = "";

  @Column()
  serverName: string = "";

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date = new Date();

  @ManyToOne(() => User, user => user.connections)
  user: User | null = null;

  @ManyToOne(() => Node, node => node.configurations)
  node: Node | null;
}