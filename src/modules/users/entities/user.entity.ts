import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Hazard } from 'src/modules/hazards/entities/hazard.entity';

@Entity('users') // Хүснэгтийн нэр
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 }) // 6 биш 50 эсвэл түүнээс дээш болгох
  user_id: string;

  @Column({ type: 'text' }) // Password hash нь үргэлж 60 тэмдэгт байдаг тул 'text' эсвэл VARCHAR(255) болгох
  password: string;

  @Column({ length: 100 }) // Нэр урт байж болно
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ type: 'text', nullable: true })
  user_image: string;

  @Column({ length: 100, nullable: true })
  job: string;

  @Column({ default: 1 })
  user_level: number;

  @CreateDateColumn()
  created_at: Date;

  // Relation: Нэг хэрэглэгч олон аюул мэдээлж болно
  @OneToMany(() => Hazard, (hazard) => hazard.reporter)
  hazards: Hazard[];
}