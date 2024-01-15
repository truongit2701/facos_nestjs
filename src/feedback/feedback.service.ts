import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/auth.entity';
import { FeedBack } from 'src/entities/feedback.entity';
import { Order } from 'src/entities/order.entity';
import { ProductOrder } from 'src/entities/product-order.enity';
import { Product } from 'src/entities/product.entity';
import { ExceptionResponse } from 'src/utils/exception.response';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedBack) private feedbackRepo: Repository<FeedBack>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(ProductOrder)
    private productOrderRepo: Repository<ProductOrder>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async create(userId: number, body: any, product_id: number) {
    const order = await this.orderRepo
      .createQueryBuilder('order')
      .innerJoin('order.product_order', 'po')
      .where('order.user_id = :userId', { userId })
      .andWhere('po.product_id = :product_id', { product_id })
      .getOne();
    if (!order)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'The system has not seen your order yet',
      );

    const user = await this.userRepo.findOne({ where: { id: userId } });

    const fb = this.feedbackRepo.create({
      ...body,
      user: { id: userId },
      product: { id: product_id },
    });

    await this.feedbackRepo.save(fb);
    return { ...fb, user: user };
  }

  async getList(query: any) {
    const take = query.take || 4;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    const productId = query.id;
    return await this.feedbackRepo.find({
      where: { product: { id: productId } },
      relations: { user: true },
      // take,
      // skip,
      order: { created_at: 'DESC' },
    });
  }

  async getAllForAdmin() {
    const data = await this.feedbackRepo
      .createQueryBuilder('fb')
      .leftJoinAndSelect(Product, 'product', 'product.id = fb.product_id')
      .orderBy('fb.rating_point', 'DESC')
      .select([
        'product.title',
        'product.image',
        'fb.rating_point',
        'fb.content',
      ])
      .getRawMany();
    return data;
  }
}
