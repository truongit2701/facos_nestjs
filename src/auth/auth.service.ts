import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from 'src/entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { AT_SECRET, RT_SECRET } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionResponse } from 'src/utils/exception.response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const hash: any = await this.hashData(dto.password);
    const user = await this.userRepo.findOneBy({ username: dto.username });

    if (user) throw new BadRequestException('Tên đăng nhập đã được sử dụng!');

    const newUser = await this.userRepo
      .create({
        username: dto.username,
        hash,
      })
      .save();

    const tokens = await this.getTokens(newUser.id, dto.username);

    await this.updateRtHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async login(dto: AuthDto) {
    const user = await this.userRepo.findOneBy({ username: dto.username });

    if (!user) throw new BadRequestException('Người dùng không tìm thấy!');
    const passCompared = bcrypt.compareSync(dto.password, user.hash);

    if (!passCompared)
      throw new BadRequestException('Mật khẩu không chính xác!');

    const tokens = await this.getTokens(user.id, dto.username);

    await this.updateRtHash(user.id, tokens.refresh_token);

    return {
      ...user,
      ...tokens,
    };
  }

  async logout(userId: number) {
    return await this.userRepo.update(
      {
        id: userId,
      },
      { hashedRt: '' },
    );
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.userRepo.findOneBy({
      id: userId,
    });
    if (!user) throw new ForbiddenException('Quyền truy cập bị từ chối!');

    const hashCompare = await bcrypt.compare(refreshToken, user.hashedRt);
    if (!hashCompare)
      throw new ForbiddenException('Quyền truy cập bị từ chối!');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateInfo(userId: number, body: any) {
    const { username, email, address, phone, fullName } = body;
    const user: any = await this.userRepo.findOneBy({ id: userId });
    user.username = username;
    user.email = email;
    user.address = address;
    user.phone = phone;
    user.fullName = fullName;

    await this.userRepo.save(user);
    return user;
  }

  async findAll() {
    const users = await this.userRepo.find();
    return users;
  }

  async delete(adminId: number, id: number) {
    const userAdmin = await this.userRepo.findOneBy({ id: adminId });
    if (userAdmin.isAdmin) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Bạn không có quyền này!',
        null,
      );
    }

    await this.userRepo.delete({ id });
    return;
  }

  async changeRole(body: any, adminId: number, actionId: number) {
    const userAdmin = await this.userRepo.findOneBy({ id: adminId });
    if (userAdmin.isAdmin) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Bạn không có quyền này!',
        null,
      );
    }

    await this.userRepo.update({ id: actionId }, { isAdmin: body.isAdmin });
    return;
  }

  async changePassword(body: any, userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) throw new BadRequestException('Người dùng không tìm thấy!');
    const passCompared = bcrypt.compareSync(body.oldPassword, user.hash);

    if (!passCompared)
      throw new BadRequestException('Mật khẩu không chính xác!');

    const hash: any = await this.hashData(body.newPassword);

    await this.userRepo.update({ id: userId }, { hash: hash });

    return hash;
  }

  async updateRtHash(id: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.userRepo.update(
      {
        id,
      },
      {
        hashedRt: hash,
      },
    );
  }

  async getTokens(id: number, username: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          username,
        },
        {
          secret: AT_SECRET,
          expiresIn: '3day',
        },
      ),

      this.jwtService.signAsync(
        {
          sub: id,
          username,
        },
        {
          secret: RT_SECRET,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
