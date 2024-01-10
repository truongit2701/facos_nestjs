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

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @Public()
  // @Post('checkout')
  // test() {
  //   const result = this.orderService.test();
  //   return result;
  // }

  @Post()
  async create(
    @Res() res: any,
    @GetCurrentUserId() userId: number,
    @Body() createOrderDto: any,
  ) {
    const data = await this.orderService.create(userId, createOrderDto.data);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
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
}
