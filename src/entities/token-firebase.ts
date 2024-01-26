import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.entity';

@Entity('noti_token')
export class NotiToken extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column({ default: '' })
  token_key: string;

  @Column({ default: 0 })
  is_admin: number;
}
