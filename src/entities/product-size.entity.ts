import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { Size } from './size.entity';

@Entity('product_size')
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
