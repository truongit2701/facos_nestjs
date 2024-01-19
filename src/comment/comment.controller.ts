import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCurrentUserId } from 'src/common/decorators';
import { BaseResponse } from 'src/utils/base.response';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create/:id')
  async create(
    @Res() res: any,
    @Body() createCommentDto: CreateCommentDto,
    @Param() param: any,
    @GetCurrentUserId() user_id: number,
  ) {
    const data = await this.commentService.create(
      user_id,
      param.id,
      createCommentDto,
    );
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Get('cmt-of-blog/:id')
  async findCmtOfBlog(@Res() res: any, @Param('id') id: string) {
    const data = await this.commentService.findCmtOfBlog(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Patch(':id')
  async update(
    @Res() res: any,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const data = await this.commentService.update(+id, updateCommentDto);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
