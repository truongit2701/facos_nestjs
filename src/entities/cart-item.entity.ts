import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { Size } from './size.entity';

@Entity('cart_item')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.id)
  cart_id: Cart;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.id)
  product_id: Product;

  @ManyToOne(() => Size, (size) => size.id)
  size_id: Size;
}
