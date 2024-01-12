import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModel } from './base.entity';
import { Discount } from './discount.entity';
import { ProductSize } from './product-size.entity';

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

  @Column({ default: 0 })
  code: number;

  @OneToMany(() => ProductSize, (p_s) => p_s.product)
  product_sizes: ProductSize[];

  @Column({ default: 1 })
  status: number;

  @ManyToOne(() => Discount, (discount) => discount.id, { nullable: true })
  @JoinColumn({
    name: 'discount_id',
  })
  discount: Discount;
}
