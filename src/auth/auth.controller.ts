import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { BaseResponse } from 'src/utils/base.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refresh(userId, refreshToken);
  }

  @Post('/updateInfo')
  @HttpCode(HttpStatus.OK)
  async updateInfo(
    @Res() res: any,
    @GetCurrentUserId() userId: number,
    @Body() body: any,
  ) {
    const data = await this.authService.updateInfo(userId, body);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getListUser(@Res() res: any) {
    const data = await this.authService.findAll();
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('/delete')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Res() res: any,
    @GetCurrentUserId() userId: number,
    @Param('id') id: string,
  ) {
    await this.authService.delete(userId, +id);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('/changeRole')
  @HttpCode(HttpStatus.OK)
  async changeRole(
    @Res() res: any,
    @GetCurrentUserId() userId: number,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    await this.authService.changeRole(body, +userId, +id);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('/changePassword')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Res() res: any,
    @GetCurrentUserId() userId: number,
    @Body() body: any,
  ) {
    const data = await this.authService.changePassword(body, +userId);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }
}
