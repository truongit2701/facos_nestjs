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
  async reaction(id: number, user_id: number, type: number) {
    const likes =
      type === 0
        ? () => `ARRAY_REMOVE(likes, '${+user_id}')`
        : () => `array_cat(likes ,ARRAY[${+user_id}])`;

    return await this.blogRepo.update({ id: +id }, { likes });
  }
  async detail(id: number) {
    const blog = await this.blogRepo.findOne({
      where: {
        id,
      },
      relations: [
        'comments',
        'comments.author',
        'author',
        'comments.children',
        'comments.children.author',
      ],
    });

    if (blog) {
      blog.comments = blog.comments.sort((a, b) => {
        return b.created_at.getTime() - a.created_at.getTime();
      });

      blog.comments.forEach((comment) => {
        comment.children = comment.children.sort((a, b) => {
          return b.created_at.getTime() - a.created_at.getTime();
        });
      });
    }

    return blog;
  }
}
