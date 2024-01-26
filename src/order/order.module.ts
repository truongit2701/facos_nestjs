import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { ProductOrder } from 'src/entities/product-order.enity';
import { Notify } from 'src/entities/notify.entity';
import { ProductSize } from 'src/entities/product-size.entity';
import { NotiToken } from 'src/entities/token-firebase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Product,
      ProductOrder,
      Notify,
      ProductSize,
      NotiToken,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
