import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './auth.entity';
import { BaseModel } from './base.entity';
import { Blog } from './blog.entity';

@Entity('comment_blog')
export class CommentBlog extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  content: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  author: User;

  @ManyToOne(() => Blog, (blog) => blog.comments, { nullable: true })
  @JoinColumn({
    name: 'blog_id',
  })
  blog: Blog;

  @OneToMany(() => CommentBlog, (comment) => comment.parent, { nullable: true })
  children: CommentBlog[];

  @ManyToOne(() => CommentBlog, (comment) => comment.children, {
    nullable: true,
  })
  @JoinColumn({
    name: 'parent_id',
  })
  parent: CommentBlog;
}
