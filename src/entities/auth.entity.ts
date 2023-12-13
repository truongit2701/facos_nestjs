import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.entity';

@Entity('user')
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ default: '' })
  fullName: string;

  @Column()
  hash: string;

  @Column({ default: 0 }) // 1: true, 2: false
  isAdmin: number;

  @Column({ default: '' })
  hashedRt: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  phone: string;
}
