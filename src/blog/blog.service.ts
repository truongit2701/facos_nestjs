import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/auth.entity';
import { Blog } from 'src/entities/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogService {
  constructor(
    // @InjectRepository(User)
    // private userRepo: Repository<User>,
    @InjectRepository(Blog)
    private blogRepo: Repository<Blog>,
  ) {}

  async create(user_id: number, body: any) {
    const { title, value, banner, tags } = body.body;

    await this.blogRepo
      .create({
        title,
        content: value,
        author: { id: user_id },
        banner,
        tags,
      })
      .save();
  }

  async get() {
    return await this.blogRepo.find({
      relations: { author: true },
      order: { created_at: 'DESC' },
    });
  }

  async detail(id: number) {
    return await this.blogRepo.findOne({
      where: {
        id,
      },
      relations: { author: true },
    });
  }
}
