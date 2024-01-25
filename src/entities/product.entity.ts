import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModel } from './base.entity';
import { Promotion } from './promotion.entity';
import { ProductSize } from './product-size.entity';

@Entity('product')
export class Product extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: string;

  @Column({ default: 0 })
  import_price: string;

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

  @OneToMany(() => ProductSize, (p_s) => p_s.product)
  product_sizes: ProductSize[];

  @Column({ default: 1 })
  status: number;

  @ManyToOne(() => Promotion, (promotion) => promotion.id, { nullable: true })
  @JoinColumn({
    name: 'promotion_id',
  })
  promotion: Promotion;

  @Column({ default: 1 })
  stocking: number;
}
