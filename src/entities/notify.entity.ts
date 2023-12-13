import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notify')
export class Notify {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  is_seen: number;

  @Column()
  type: number; // 1: thông báo có đơn hàng, 2: thông báo có user mới tạo
}
