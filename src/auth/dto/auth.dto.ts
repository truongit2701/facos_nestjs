import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  username: string;

  @IsNotEmpty()
  password: string;
}
