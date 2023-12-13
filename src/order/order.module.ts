import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { ProductOrder } from 'src/entities/product-order';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, ProductOrder])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
