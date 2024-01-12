import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Notify } from 'src/entities/notify.entity';
import { Order } from 'src/entities/order.entity';
import { ProductOrder } from 'src/entities/product-order';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductOrder)
    private productOrderRepo: Repository<ProductOrder>,
    @InjectRepository(Notify)
    private notiRepo: Repository<Notify>,
  ) {}

  async getAllForAdmin() {
    return await this.orderRepo.find({
      relations: {
        product_order: true,
        user: true,
      },
      order: {
        status: 'ASC',
        created_at: 'DESC',
      },
    });
  }

  async create(userId: number, createOrderDto: any) {
    const { list, info } = createOrderDto;
    const order = new Order();
    const totalPrice = list.reduce(
      (accumulator: any, currentValue: any) =>
        (accumulator += currentValue.price * currentValue.quantity),
      0,
    );

    order.orderDate = new Date();
    order.total = totalPrice;
    order.fullName = info.fullName;
    order.address = info.address;
    order.phone = info.phone;

    const newOrder = this.orderRepo.create({
      ...order,
      user: { id: userId },
    });

    await this.orderRepo.save(newOrder);

    await this.productOrderRepo
      .createQueryBuilder()
      .insert()
      .values(
        list.map((item: ProductOrder) => ({
          ...item,
          order: { id: newOrder.id },
          quantity: item.quantity,
        })),
      )
      .execute();

    return { order_id: newOrder.id };
  }

  async findAll(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 0 },
      relations: { product_order: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOrderAccepted(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 1 },
      relations: { product_order: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findAllRejected(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 2 },
      relations: { product_order: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findAllDone(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 3 },
      relations: { product_order: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return await this.orderRepo.findOne({
      where: { id },
      relations: { user: true, product_order: true },
    });
  }

  async reject(id: number, body: any) {
    const order = await this.orderRepo.findOneBy({ id });

    order.status = 2; // hủy đơn
    order.reason = body.reason; //lý do
    await this.orderRepo.save(order);
    return;
  }

  async changeStatus(id: number, date: string) {
    await this.orderRepo.update(
      {
        id,
      },
      {
        status: 1,
        dateExcepted: date,
        dateAccept: moment(),
      },
    );
  }

  async count(user_id: number) {
    const data = await this.orderRepo
      .createQueryBuilder('order')
      .select('status')
      .addSelect('COUNT(*)', 'total')
      .where('order.user_id = :user_id', { user_id })
      .groupBy('status')
      .orderBy('order.status', 'ASC')
      .getRawMany();

    const mappedData: any[] = Array.from({ length: 4 }, (_, i) => ({
      status: i,
      total: '0',
    }));

    for (const item of data) {
      const { status, total } = item;
      const foundItem = mappedData.find((data) => data.status === status);

      if (foundItem) {
        foundItem.total = total;
      }
    }

    return mappedData;
  }

  async getNewOrder() {
    return await this.orderRepo.find({
      where: { status: 0 },
      relations: { product_order: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async orderHasBeenDeleted() {
    return await this.orderRepo.find({
      where: { status: 3 },
      relations: { product_order: true },
      order: {
        created_at: 'DESC',
      },
    });
  }
}
