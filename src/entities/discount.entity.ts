import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.entity';
import { Product } from './product.entity';

@Entity('discount')
export class Discount extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column({ default: '' })
  title: string;

  @Column()
  description: string;

  @Column({ default: 1 })
  is_active: number;

  @Column({ default: 0 })
  percent: number;

  @OneToMany(() => Product, (product) => product.discount, { nullable: true })
  product_order: Product;
}
