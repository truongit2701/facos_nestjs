import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.entity';

@Entity('notify')
export class Notify extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  is_seen: number; // 0: chua xem, 1: da xem

  @Column()
  type: number; // 1: thông báo có đơn hàng, 2: thông báo có user mới tạo

  @Column({ nullable: true })
  action_id: number;

  @Column()
  title: string;

  @Column()
  content: string;
}
