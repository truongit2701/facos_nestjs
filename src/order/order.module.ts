import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { ProductOrder } from 'src/entities/product-order';
import { Notify } from 'src/entities/notify.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, ProductOrder, Notify])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
