import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notify } from 'src/entities/notify.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotiToken } from 'src/entities/token-firebase';

@Module({
  imports: [TypeOrmModule.forFeature([Notify, NotiToken])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
