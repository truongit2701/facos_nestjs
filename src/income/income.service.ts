import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/auth.entity';
import { Order } from 'src/entities/order.entity';
import { ProductOrder } from 'src/entities/product-order';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductOrder)
    private productOrderRepo: Repository<ProductOrder>,
  ) {}
  async getIncomeOrderYear(year: string) {
    const records = await this.orderRepo
      .createQueryBuilder('order')
      .select(
        'EXTRACT(YEAR FROM order.created_at) as year, EXTRACT(MONTH FROM order.created_at) as month, SUM(order.total) as total_amount',
      )
      .where('order.created_at >= :startDate', {
        startDate: `${year}-01-01T00:00:00.000Z`,
      })
      .andWhere('order.created_at <= :endDate', {
        endDate: `${year}-12-31T23:59:59.999Z`,
      })
      .groupBy(
        'EXTRACT(YEAR FROM order.created_at), EXTRACT(MONTH FROM order.created_at)',
      )
      .getRawMany();

    return records;
  }

  async getStats(time: any) {
    const [year, month] = time.split('-').map(Number);

    const getStartDate = (year: number, month: number) =>
      new Date(`${year}-${month < 10 ? `0${month}` : month}-01T00:00:00.000Z`);
    const getEndDate = (year: number, month: number) =>
      new Date(`${year}-${month < 10 ? `0${month}` : month}-30T00:00:00.000Z`);

    const timeCondition = {
      startDate: getStartDate(year, month === 1 ? 12 : month - 1),
      endDate: getEndDate(year, month),
    };

    const customerQuery = this.userRepo
      .createQueryBuilder('user')
      .where('user.created_at > :startDate', {
        startDate: timeCondition.startDate,
      })
      .andWhere('user.created_at < :endDate', {
        endDate: timeCondition.endDate,
      })
      .select('DATE_PART(\'month\', "created_at")', 'month')
      .addSelect('COUNT(*)', 'count')
      .addGroupBy("DATE_PART('month', user.created_at)")
      .orderBy('month', 'ASC')
      .getRawMany();

    const orderQuery = this.productOrderRepo
      .createQueryBuilder('order')
      .leftJoin('order.order', 'table_order')
      .andWhere('table_order.status = :status', { status: 3 })
      .where('order.created_at > :startDate', {
        startDate: timeCondition.startDate,
      })
      .andWhere('order.created_at < :endDate', {
        endDate: timeCondition.endDate,
      })
      .select('EXTRACT(MONTH FROM order.created_at)::integer', 'month')
      .addGroupBy('EXTRACT(MONTH FROM order.created_at)')
      .addSelect('COUNT(*)', 'count')
      .orderBy('month', 'ASC')
      .getRawMany();

    const productQuery = this.productRepo
      .createQueryBuilder('product')
      .where('product.created_at > :startDate', {
        startDate: timeCondition.startDate,
      })
      .andWhere('product.created_at < :endDate', {
        endDate: timeCondition.endDate,
      })
      .select('DATE_PART(\'month\', "created_at")', 'month')
      .addGroupBy("DATE_PART('month', product.created_at)")
      .addSelect('COUNT(*)', 'count')
      .orderBy('month', 'ASC')
      .getRawMany();

    const adminQuery = this.userRepo
      .createQueryBuilder('user')
      .where('user.created_at > :startDate', {
        startDate: timeCondition.startDate,
      })
      .andWhere('user.created_at < :endDate', {
        endDate: timeCondition.endDate,
      })
      .andWhere('user.isAdmin != :condition', { condition: 0 })
      .addGroupBy('EXTRACT(MONTH FROM user.created_at)')
      .select('EXTRACT(MONTH FROM user.created_at)::integer', 'month')
      .addSelect('COUNT(*)', 'count')
      .orderBy('month', 'ASC')
      .getRawMany();

    const [customers, orders, products, admins] = await Promise.all([
      customerQuery,
      orderQuery,
      productQuery,
      adminQuery,
    ]);

    return {
      customers,
      orders,
      products,
      admins,
    };
  }

  async getTopSelling() {
    const data = await this.productOrderRepo
      .createQueryBuilder('po')
      .select([
        'po.product_id',
        'SUM(po.quantity) AS total_quantity',
        'po.title',
        'po.price',
        'po.image',
        'po.category',
        'po.style',
      ])
      .innerJoin('po.order', 'table_order', 'table_order.status = :status', {
        status: 3,
      })
      .groupBy(
        'po.product_id, po.title, po.price, po.image, po.category, po.style',
      )
      .orderBy('total_quantity', 'DESC')
      .limit(3)
      .getRawMany();
    return data;
  }
}
