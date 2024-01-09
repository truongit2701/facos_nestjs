import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModel } from './base.entity';
import { ProductSize } from './product-size.entity';
import { Order } from './order.entity';
import { Size } from './size.entity';

@Entity('product')
export class Product extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: string;

  @Column()
  image: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  category: string;

  @Column({ default: '' })
  style: string;

  @Column({ default: '' })
  code: string;

  @Column({ nullable: true })
  size: string;
}
