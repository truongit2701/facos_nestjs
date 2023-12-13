import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/auth.entity';
import { Product } from 'src/entities/product.entity';
import { ProductOrder } from 'src/entities/product-order';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product, ProductOrder])],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
