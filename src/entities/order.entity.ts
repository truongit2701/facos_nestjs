import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './auth.entity';
import { BaseModel } from './base.entity';
import { ProductOrder } from './product-order';

@Entity('order')
export class Order extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column({ default: 0 }) //0: chua duyet, 1: dang giao, 2: da huy
  status: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column()
  orderDate: Date;

  @Column({ nullable: true })
  dateAccept: Date;

  @Column({ nullable: true })
  dateDelivery: string;

  @Column({ nullable: true })
  dateExcepted: string;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => ProductOrder, (order) => order.order)
  product_order: ProductOrder;
}
