import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { BaseResponse } from 'src/utils/base.response';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('/create')
  async create(@Res() res: any, @Body() createPromotionDto: any) {
    await this.promotionService.create(createPromotionDto);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('/assign/:id')
  assign(@Res() res: any, @Body() body: any, @Param('id') id: string) {
    this.promotionService.assignPromotion(+id, body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Get('')
  async findAll(@Res() res: any) {
    const data = await this.promotionService.findAll();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('/products/:id')
  async findProducts(@Res() res: any, @Param('id') id: string) {
    const data = await this.promotionService.findProducts(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('/turn-off/:id')
  turnOffPromotion(@Res() res: any, @Param('id') id: string) {
    this.promotionService.turnOffPromotion(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }
}
