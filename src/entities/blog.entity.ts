import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModel } from './base.entity';
import { User } from './auth.entity';
import { CommentBlog } from './comment-blog.entity';

@Entity('blog')
export class Blog extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  content: string;

  @Column()
  title: string;

  @Column()
  banner: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  author: User;

  @OneToMany(() => CommentBlog, (comment) => comment.blog, { nullable: true })
  comments: CommentBlog[];

  @Column('integer', { array: true, nullable: true })
  likes: number[];
}
