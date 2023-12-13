import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Size } from './size.entity';

@Entity('productSize')
export class ProductSize {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @ManyToOne(() => Size, (size) => size.id)
  @JoinColumn({
    name: 'size_id',
  })
  size: Size;
}
