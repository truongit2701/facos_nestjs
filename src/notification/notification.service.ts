import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notify } from 'src/entities/notify.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notify) private notifiRepo: Repository<Notify>,
  ) {}

  async getTotal() {
    const count = await this.notifiRepo
      .createQueryBuilder('n')
      .where('n.is_seen = :is_seen', { is_seen: 0 })
      .getCount();
    return count;
  }

  async getList() {
    const list = await this.notifiRepo.find();
    return list;
  }
}
