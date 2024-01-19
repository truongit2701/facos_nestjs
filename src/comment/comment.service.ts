import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentBlog } from 'src/entities/comment-blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentBlog) private commentRepo: Repository<CommentBlog>,
  ) {}

  async create(
    user_id: number,
    blog_id: number,
    createCommentDto: CreateCommentDto,
  ) {
    const { content, parent_id } = createCommentDto;

    const parent =
      parent_id && (await this.commentRepo.findOneBy({ id: parent_id }));
    let new_comment: CommentBlog;
    if (!parent) {
      new_comment = await this.commentRepo
        .create({
          blog: { id: blog_id },
          content: content,
          author: { id: user_id },
        })
        .save();
    } else {
      new_comment = await this.commentRepo
        .create({
          content: content,
          parent: { id: parent_id },
          author: { id: user_id },
        })
        .save();
    }

    return new_comment;
  }

  findAll() {
    return `This action returns all commenrưưưeưsưst`;
  }

  async findOne(id: number) {
    const data = await this.commentRepo.find({
      where: { blog: { id } },
      relations: { children: true, author: true },
    });

    return data;
  }

  async findCmtOfBlog(id: number) {
    const data = await this.commentRepo.find({
      where: { blog: { id } },
      relations: ['children', 'children.author', 'author'],
    });

    return data;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
