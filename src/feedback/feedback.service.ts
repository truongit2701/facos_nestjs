import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/auth.entity';
import { FeedBack } from 'src/entities/feedback.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedBack) private feedbackRepo: Repository<FeedBack>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(userId: number, body: any) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const fb = this.feedbackRepo.create({
      ...body,
      user: { id: userId },
      product: { id: body.productId },
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
}
