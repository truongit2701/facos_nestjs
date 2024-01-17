import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { BaseResponse } from 'src/utils/base.response';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  create(@GetCurrentUserId() user_id: number, @Body() body: any) {
    this.blogService.create(user_id, body);
  }

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async get(@Res() res: any) {
    const data = await this.blogService.get();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async detail(@Res() res: any, @Param() param: any) {
    const data = await this.blogService.detail(param.id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
