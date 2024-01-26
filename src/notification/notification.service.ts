import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/auth.entity';
import { Notify } from 'src/entities/notify.entity';
import { NotiToken } from 'src/entities/token-firebase';
import { ExceptionResponse } from 'src/utils/exception.response';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notify) private notifiRepo: Repository<Notify>,
    @InjectRepository(NotiToken) private notiTokenRepo: Repository<NotiToken>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getTotal() {
    return await this.notifiRepo
      .createQueryBuilder('n')
      .where('n.is_seen = :is_seen', { is_seen: 0 })
      .getCount();
  }

  async getList() {
    return await this.notifiRepo.find({ order: { id: 'DESC' } });
  }

  async readNoti() {
    await this.notifiRepo
      .createQueryBuilder()
      .update()
      .set({ is_seen: 1 })
      .execute();
  }

  async createNoti(body: any) {
    const { title, content, type, action_id } = body;

    const data = this.notifiRepo.create({
      title,
      content,
      type,
      action_id,
    });

    await this.notifiRepo.save(data);

    return data;
  }

  async createToken(user_id: number, body: any): Promise<any> {
    if (!Object.keys(body).length || !body.data)
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Token đâu?');
    const notiToken = await this.notiTokenRepo.findOneBy({
      token_key: body.data,
    });

    const user = await this.userRepo.findOneBy({ id: user_id });

    if (notiToken) {
      await this.notiTokenRepo.save({
        ...notiToken,
        token_key: body.data,
        is_admin: user.isAdmin,
      });

      return notiToken;
    }

    return await this.notiTokenRepo
      .create({
        user_id,
        token_key: body.data,
        is_admin: user.isAdmin,
      })
      .save();
  }

  async getDataNoti() {
    const data = await this.notiTokenRepo.findOneBy({ id: 1 });

    return { token: data.token_key };
  }
}
