import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('system_logs')
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id: string = "";

  @Column({
    type: 'enum',
    enum: ['info', 'warning', 'error'],
    default: 'info'
  })
  level: string = "";

  @Column()
  message: string = "";

  @Column({ nullable: true })
  errorCode: string = "";

  @Column({ nullable: true })
  userId: string = "";

  @Column({ nullable: true })
  ipAddress: string = "";

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();
}