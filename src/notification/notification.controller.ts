import { Body, Controller, Get, Post } from '@nestjs/common';
import * as FCM from 'fcm-node';
import * as admin from 'firebase-admin';
import { Public } from 'src/common/decorators';
import { BaseResponse } from 'src/utils/base.response';
import { NotificationService } from './notification.service';

@Controller('notify')
export class NotificationController {
  private fcm: FCM;

  constructor(private notificationService: NotificationService) {
    const serviceAccount = require('../facos-notification-fec24-firebase-adminsdk-zgwam-6d93c5ca18.json');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    this.fcm = new FCM(process.env.FIREBASE_SERVER_NOTIFY_KEY);
  }

  @Public()
  @Post('/send-noti')
  async sendNotification(
    @Body() body: { title: string; content: string; token_key: string },
  ): Promise<any> {
    try {
      const message = {
        to: body.token_key,
        notification: {
          title: body.title,
          body: body.content,
        },
      };

      this.fcm.send(message, function (err, response) {
        if (err) {
          console.log('Có lỗi xảy ra:', err);
        } else {
          console.log('Đã gửi thành công, response: ', response);
        }
      });
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('total')
  async getTotal() {
    const data = await this.notificationService.getTotal();

    return new BaseResponse({ data });
  }

  @Get('list')
  async getList() {
    const data = await this.notificationService.getList();

    return new BaseResponse({ data });
  }
}
