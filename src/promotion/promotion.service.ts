import { HttpStatus, Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import * as moment from 'moment';
import { Product, Promotion } from 'src/entities';
import { ExceptionResponse } from 'src/utils/exception.response';
import { Repository } from 'typeorm';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  //     * * * * * *
  // | | | | | |
  // | | | | | +-- Ngày trong tuần (0 - 6) (Chủ Nhật là 0 hoặc 7)
  // | | | | +---- Tháng (1 - 12)
  // | | | +------ Ngày trong tháng (1 - 31)
  // | | +-------- Giờ (0 - 23)
  // | +---------- Phút (0 - 59)
  // +------------ Giây (0 - 59)

  async startPromotionJob() {
    const cronJobCheck = new CronJob(
      CronExpression.EVERY_DAY_AT_MIDNIGHT,
      async () => {
        console.log('Kiểm tra chương trình mỗi đêm!');
        this.promotionCronjob();
      },
    );
    cronJobCheck.start();
  }

  async promotionCronjob() {
    const promotion = await this.promotionRepository.findOneBy({
      id: undefined,
      status: 1,
    });

    if (!promotion) {
      console.log('Không có chương trình!');
      return;
    }

    const current_date = moment().startOf('day');
    const end_date = moment(promotion.end_date).startOf('day');
    const start_date = moment(promotion.start_date).startOf('day');
    if (current_date.isAfter(moment(end_date))) {
      console.log(`Chương trình ${promotion.title} dừng lại - ${end_date}`);

      if (promotion.is_running === 1)
        await this.promotionRepository.update(
          { id: promotion.id },
          { is_running: 0, status: 0 },
        );
      return;
    }

    if (current_date.isSame(moment(start_date))) {
      console.log(`Bắt đầu chạy chương trình ${start_date}`);

      if (promotion.is_running === 0)
        await this.promotionRepository.update(
          { id: promotion.id },
          { is_running: 1 },
        );

      return;
    }

    if (current_date.isBefore(moment(start_date))) {
      console.log(
        `Chương trình đang chuẩn bị chạy vào ${promotion.start_date}`,
      );
      return;
    }

    if (current_date.isAfter(moment(start_date))) {
      console.log(
        `Chương trình đang chạy từ ${promotion.start_date} - ${promotion.end_date}`,
      );
      return;
    }
  }

  async create(createPromotionDto: any) {
    const { title, description, percent, start_date, end_date } =
      createPromotionDto;

    if (moment().isSameOrAfter(moment(start_date), 'day'))
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'The start date cannot be less than or equal the current date!',
      );

    const promotion = await this.promotionRepository.findOneBy({
      status: 1,
    });

    if (promotion)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        `Promotion ${promotion.title} is running!`,
      );

    const newPromotion = await this.promotionRepository
      .create({
        type: 0,
        title,
        description,
        percent,
        start_date,
        end_date,
        is_running: 0,
      })
      .save();

    return newPromotion;
  }

  async assignPromotion(id: number, body: any) {
    const { product_ids } = body;
    for (const productId of product_ids) {
      await this.productRepo.update(
        { id: productId },
        { promotion: { id: id } },
      );
    }
  }

  async findAll() {
    return await this.promotionRepository.find({ order: { status: 'DESC' } });
  }

  async findProducts(id: number) {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
    });
    const products = await this.productRepo
      .createQueryBuilder('product')
      .select('*')
      .addSelect(
        `CASE WHEN product.promotion_id = ${id} THEN 1 ELSE 0 END`,
        'is_active',
      )
      .where('product.status = :status', { status: 1 })
      .orderBy('product.id', 'ASC')
      .getRawMany();

    return {
      promotion,
      products,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} promotion`;
  }

  async turnOffPromotion(id: number) {
    await this.promotionRepository.update({ id }, { status: 0, is_running: 0 });

    await this.productRepo
      .createQueryBuilder()
      .update(Product)
      .set({ promotion: { id: null } })
      .execute();
  }
}
