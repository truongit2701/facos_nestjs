import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notify } from 'src/entities/notify.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotiToken } from 'src/entities/token-firebase';
import { User } from 'src/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notify, NotiToken, User])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
