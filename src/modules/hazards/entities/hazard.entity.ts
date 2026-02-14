import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

// Enum-ыг entity-ийн дээр тодорхойлох нь TypeScript-д илүү тохиромжтой
export enum HazardType {
  FIRE = 'Гал түймэр',
  ENVIRONMENT = 'Ажлын орчин',
  HAND_TOOLS = 'Гар багаж', // TOOLS -> HAND_TOOLS
  STATIONARY_EQUIPMENT = 'Суурин тоног төхөөрөмж', // ELECTRICAL -> STATIONARY_EQUIPMENT
  MOBILE_EQUIPMENT = 'Хөдөлгөөнт тоног төхөөрөмж', // CHEMICAL -> MOBILE_EQUIPMENT
  MANUAL_OPERATION = 'Гар ажиллагаа', // FALL -> MANUAL_OPERATION
  MATERIALS = 'Материал түүхий эд', // MECHANICAL -> MATERIALS
  BEHAVIOR = 'Арга барил, үйлдэл', // RADIATION -> BEHAVIOR
  ENERGY_SOURCE = 'Энергийн эх үүсвэр', // NOISE -> ENERGY_SOURCE
  WEATHER = 'Байгаль цаг уур', // BIOLOGICAL -> WEATHER
  CONTRACTOR = 'Гэрээтийн үйл ажиллагаа', // ERGONOMIC -> CONTRACTOR
  OTHER = 'Бусад',
}

export enum HazardImpact {
  HUMAN = 'Хүнд',
  PROPERTY = 'Эд хөрөнгөд',
  NATURE = 'Байгаль орчинд',
}
export enum HazardLevel {
  VERY_HIGH = 'Маш их',
  HIGH = 'Их',
  NORMAL = 'Дунд зэрэг',
  LOW = 'Бага',
  VERY_LOW = 'Маш бага',
}

export enum HazardStatus {
  PENDING = 'Хүлээгдэж буй',
  DECLINE = 'Цуцалсан',
  ACCEPT = 'Баталсан',
  DONE = 'Арилгасан',
}

export enum HazardMainType {
  REPORT = 'Мэдээлсэн',
  FIXED = 'Арилгасан',
}
@Entity('hazards')
export class Hazard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: HazardMainType,
  })
  main_type: HazardMainType;

  @Column({
    type: 'enum',
    enum: HazardType,
    default: HazardType.OTHER,
  })
  type: HazardType;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: HazardImpact,
    default: HazardImpact.HUMAN,
  })
  impact: HazardImpact;

  @Column({
    type: 'enum',
    enum: HazardLevel,
    default: HazardLevel.NORMAL,
  })
  level: HazardLevel;

  @Column({ nullable: true }) // Зураггүй байж болзошгүй бол nullable болгож болно
  image: string;

  @Column({
    type: 'enum',
    enum: HazardStatus,
    default: HazardStatus.PENDING,
  })
  status: HazardStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn() // Өөрчлөлт орох бүрт цаг нь автоматаар шинэчлэгдэнэ
  modified_at: Date;

  @Column({ type: 'timestamp', nullable: true }) // Аюулыг хаах үед гараар цаг онооно
  closed_at: Date;

  @ManyToOne(() => User, (user) => user.hazards)
  reporter: User;
}
