import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModel } from './base.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
interface ProductSubset
  extends Pick<Product, 'title' | 'price' | 'image' | 'id'>,
    BaseModel {
  sizeActive: string;
}

@Entity('product_order')
export class ProductOrder extends Product implements ProductSubset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sizeActive: string;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Order, (order) => order.product_order)
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @Column({ nullable: true })
  product_id: number;
}
