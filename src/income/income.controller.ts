import { Controller, Get, Param, Query } from '@nestjs/common';
import { IncomeService } from './income.service';
import { BaseResponse } from 'src/utils/base.response';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get('/order/:year')
  async getIncomeOrderYear(@Param('year') year: string) {
    const data = await this.incomeService.getIncomeOrderYear(year);
    return new BaseResponse({ data });
  }

  @Get('/stats/:time')
  async getStats(@Param('time') time: any) {
    const data = await this.incomeService.getStats(time);
    return new BaseResponse({ data });
  }

  @Get('/product/')
  async getTopSelling() {
    const data = await this.incomeService.getTopSelling();
    return new BaseResponse({ data });
  }

  @Get('/summary/')
  async getSummary() {
    const data = await this.incomeService.getSummary();
    return new BaseResponse({ data });
  }

  /** ORDERS */
  @Get('pending')
  async getPendingOrder() {
    const data = await this.incomeService.getPendingOrder();
    return new BaseResponse({ data });
  }
}
