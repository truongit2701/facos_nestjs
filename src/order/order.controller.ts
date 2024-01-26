import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { BaseResponse } from 'src/utils/base.response';
import { OrderService } from './order.service';
import * as FCM from 'fcm-node';
import * as admin from 'firebase-admin';

@Controller('order')
export class OrderController {
  private fcm: FCM;

  constructor(private readonly orderService: OrderService) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
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

  @Post()
  async create(
    @Res() res: any,
    @GetCurrentUserId() userId: number,
    @Body() createOrderDto: any,
  ) {
    try {
      const data = await this.orderService.create(userId, createOrderDto.data);
      const title = 'Mango have a new order';
      const noti = await this.orderService.createNoti({ ...data, title });

      const tokens = await this.orderService.getFirebaseAdminTokens();

      console.log(
        '---------------- payload create order admin send notify ---------------',
        {
          registration_ids: tokens,
          // to: tokens[0],
          notification: {
            title,
            body: '',
            obj: noti,
          },
        },
      );

      const message = {
        registration_ids: tokens,
        // to: tokens[0],
        notification: {
          title,
          body: '',
          obj: noti,
        },
      };

      await this.fcm.send(message, function (err, response) {
        if (err) {
          console.log('Có lỗi xảy ra khi gửi thông báo tạo đơn hàng:', err);
          return;
        } else {
          console.log('Gửi thông báo tạo đơn hàng thành công ', response);
        }
      });
      return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
    } catch (err) {
      console.log(err);
    }
  }

  @Get()
  async getAllForAdmin(@Res() res: any) {
    const data = await this.orderService.getAllForAdmin();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('/pending')
  async findAll(@Res() res: any, @GetCurrentUserId() userId: number) {
    const data = await this.orderService.findAll(userId);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('/accepted')
  async findAllAccepted(@Res() res: any, @GetCurrentUserId() userId: number) {
    const data = await this.orderService.findOrderAccepted(userId);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('/rejected')
  async findAllRejected(@Res() res: any, @GetCurrentUserId() userId: number) {
    const data = await this.orderService.findAllRejected(userId);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('/done')
  async findAllDone(@Res() res: any, @GetCurrentUserId() userId: number) {
    const data = await this.orderService.findAllDone(userId);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return new BaseResponse({ data: await this.orderService.findOne(+id) });
  }

  @Post('/reject/:id')
  update(@Res() res: any, @Param('id') id: string, @Body() body: any) {
    this.orderService.reject(+id, body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('/change-status/:id')
  changeStatus(@Res() res: any, @Param('id') id: string, @Body() body: any) {
    this.orderService.changeStatus(+id, body.date);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('/confirm-delivery/:id')
  confirmDelivery(@Res() res: any, @Param('id') id: string) {
    this.orderService.confirmDelivery(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Get('/quantity')
  async count(@Res() res: any, @GetCurrentUserId() userId: number) {
    const data = await this.orderService.count(userId);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('/new')
  async newOrder(@Res() res: any) {
    const data = await this.orderService.getNewOrder();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('/has-been-deleted')
  async orderHasBeenDeleted(@Res() res: any) {
    const data = await this.orderService.orderHasBeenDeleted();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('/delivering')
  async orderDelivering(@Res() res: any) {
    const data = await this.orderService.orderDelivering();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
