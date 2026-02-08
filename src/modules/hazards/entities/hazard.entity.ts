import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('hazards')
export class Hazard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'pending' }) // pending, resolved, dismissed
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  modified_at: Date;

  @CreateDateColumn()
  closed_at: Date;

  @Column({type:'text'})
  modified: string;

  // Хэрэглэгчтэй холбох (Foreign Key)
  @ManyToOne(() => User, (user) => user.hazards)
  reporter: User;
}