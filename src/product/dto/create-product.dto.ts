import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  style: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  description: string;

  @IsArray()
  size: object[];
}
