import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductSize } from 'src/entities/product-size.entity';
import { ProductOrder } from 'src/entities/product-order.enity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductSize, ProductOrder])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
