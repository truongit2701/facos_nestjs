import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Order } from 'src/entities/order.entity';
import { ProductOrder } from 'src/entities/product-order.enity';
import { ProductSize } from 'src/entities/product-size.entity';
import { Product } from 'src/entities/product.entity';
import { In, Repository } from 'typeorm';
import { Notify } from 'src/entities/notify.entity';
import { NotiToken } from 'src/entities/token-firebase';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Notify) private notifyRepo: Repository<Notify>,
    @InjectRepository(NotiToken) private notiTokenRepo: Repository<NotiToken>,
    @InjectRepository(ProductOrder)
    private productOrderRepo: Repository<ProductOrder>,

    @InjectRepository(ProductSize)
    private productSizeRepo: Repository<ProductSize>,
    @InjectRepository(Notify)
    private notiRepo: Repository<Notify>,
  ) {}

  async getAllForAdmin() {
    return await this.orderRepo.find({
      relations: ['user', 'product_order', 'product_order.product'],
      order: {
        status: 'ASC',
        created_at: 'DESC',
      },
    });
  }

  async create(userId: number, createOrderDto: any) {
    const { list, info } = createOrderDto;
    const order = new Order();
    order.orderDate = new Date();
    order.total = info.total;
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
          product: { id: item.id },
        })),
      )
      .execute();

    for (const product of list) {
      await this.productSizeRepo.update(
        { product: { id: product.id }, size: { id: product.sizeActive.id } },
        {
          stock_quantity: () => `stock_quantity - ${product.quantity}`,
        },
      );
    }

    return { order_id: newOrder.id };
  }

  async createNoti(body: any) {
    const { title, order_id } = body;

    const data = this.notifyRepo.create({
      title,
      content: '',
      type: 1,
      action_id: order_id,
    });

    await this.notifyRepo.save(data);

    return data;
  }

  async getFirebaseAdminTokens() {
    const admin_tokens_firebase = await this.notiTokenRepo.findBy({
      is_admin: 1,
    });

    return admin_tokens_firebase.map((i) => i.token_key);
  }

  async findAll(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 0 },
      relations: ['product_order', 'product_order.product'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOrderAccepted(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 1 },
      relations: ['product_order', 'product_order.product'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findAllRejected(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 2 },
      relations: ['product_order', 'product_order.product'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findAllDone(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 3 },
      relations: ['product_order', 'product_order.product'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'product_order', 'product_order.product'],
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

  async confirmDelivery(id: number) {
    await this.orderRepo.update(
      {
        id,
      },
      {
        status: 3,
        dateDelivery: new Date(),
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
      relations: ['product_order', 'product_order.product'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async orderHasBeenDeleted() {
    return await this.orderRepo.find({
      where: { status: 2 },
      relations: ['product_order', 'product_order.product'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  async orderDelivering() {
    return await this.orderRepo.find({
      where: { status: In([1, 3]) },
      relations: ['product_order', 'product_order.product'],
      order: {
        created_at: 'DESC',
      },
    });
  }
}
