import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.entity';

@Entity('promotion')
export class Promotion extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column({ default: '' })
  title: string;

  @Column()
  description: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: 0 })
  is_running: number;

  @Column({ default: 0 })
  percent: number;

  @Column({
    default: '',
  })
  start_date: string;

  @Column({
    default: '',
  })
  end_date: string;
}
