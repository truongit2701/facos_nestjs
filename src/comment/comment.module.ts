import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentBlog } from 'src/entities/comment-blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentBlog])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
