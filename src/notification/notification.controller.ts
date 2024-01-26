import { Body, Controller, Get, Post } from '@nestjs/common';
import * as FCM from 'fcm-node';
import * as admin from 'firebase-admin';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { BaseResponse } from 'src/utils/base.response';
import { NotificationService } from './notification.service';

@Controller('notify')
export class NotificationController {
  constructor(private notificationService: NotificationService) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  }

  @Public()
  @Post('/send-noti')
  async sendNotification(): Promise<any> {
    return;
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
