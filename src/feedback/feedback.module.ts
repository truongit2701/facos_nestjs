import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedBack } from 'src/entities/feedback.entity';
import { User } from 'src/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedBack, User])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
