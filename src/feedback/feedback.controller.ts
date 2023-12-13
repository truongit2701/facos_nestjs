import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { BaseResponse } from 'src/utils/base.response';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(
    @Res() res: any,
    @GetCurrentUserId() userId: number,
    @Body() body: any,
  ) {
    const data = await this.feedbackService.create(userId, body);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Public()
  @Get(':id')
  async get(@Res() res: any, @Param() param: any) {
    console.log(param);
    const data = await this.feedbackService.getList(param);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
