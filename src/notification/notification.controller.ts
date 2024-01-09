import { Body, Controller, Get, Post } from '@nestjs/common';
import * as FCM from 'fcm-node';
import * as admin from 'firebase-admin';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { BaseResponse } from 'src/utils/base.response';
import { NotificationService } from './notification.service';

@Controller('notify')
export class NotificationController {
  private fcm: FCM;

  constructor(private notificationService: NotificationService) {
    const fs = require('fs');

    const path =
      'src/facos-notification-fec24-firebase-adminsdk-zgwam-6d93c5ca18.json';
    const fileContent = fs.readFileSync(path, 'utf-8');
    const serviceAccount = JSON.parse(fileContent);

    // if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    // }
    this.fcm = new FCM(process.env.FIREBASE_SERVER_NOTIFY_KEY);
  }

  @Public()
  @Post('/send-noti')
  async sendNotification(
    @Body() body: { title: string; content: string; token_key: string },
  ): Promise<any> {
    try {
      const noti = await this.notificationService.createNoti(body);

      const message = {
        to: body.token_key,
        notification: {
          title: body.title,
          body: body.content,
          obj: noti,
        },
      };
      console.log({
        to: body.token_key,
        notification: {
          title: body.title,
          body: body.content,
          obj: noti,
        },
      });
      await this.fcm.send(message, function (err, response) {
        if (err) {
          console.log('Có lỗi xảy ra:', err);
          return;
        } else {
          console.log('Đã gửi thành công, responsee:zzz ', response);
        }
      });
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('create-token')
  async createToken(@GetCurrentUserId() userId: number, @Body() body: any) {
    const data = await this.notificationService.createToken(userId, body);
    return new BaseResponse({ data });
  }

  @Post('create-noti')
  async createNoti(@Body() body: any) {
    const data = await this.notificationService.createNoti(body);

    return new BaseResponse({ data });
  }

  @Get('count')
  async getTotal() {
    const data = await this.notificationService.getTotal();

    return new BaseResponse({ data });
  }

  @Post('read')
  readNoti() {
    this.notificationService.readNoti();

    return new BaseResponse({});
  }

  @Get('list')
  async getList() {
    const data = await this.notificationService.getList();

    return new BaseResponse({ data });
  }

  @Public()
  @Get('/data')
  async getData() {
    const data = await this.notificationService.getDataNoti();

    return new BaseResponse({ data });
  }
}
