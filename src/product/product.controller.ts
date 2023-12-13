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
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseResponse } from 'src/utils/base.response';
import { Public } from 'src/common/decorators';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const data = await this.productService.create(createProductDto);
    return new BaseResponse({ data });
  }

  @Public()
  @Get('new')
  async findNewProduct(@Res() res: any) {
    const data = await this.productService.findNewProduct();

    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Public()
  @Get()
  async findAll(@Res() res: any, @Query() query: any) {
    const data = await this.productService.findAll(query);

    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Get('/admin')
  async findAllAdmin(@Res() res: any) {
    const data = await this.productService.findAllAdmin();

    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Public()
  @Get(':id')
  async findOne(@Res() res: any, @Param('id') id: string) {
    const data = await this.productService.findOne(+id);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }));
  }

  @Post('/update/:id')
  async update(@Res() res: any, @Param() param: any, @Body() body: any) {
    await this.productService.update(+param.id, body);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }

  @Post('/delete/:id')
  async delete(@Res() res: any, @Param() param: any) {
    await this.productService.remove(+param.id);
    return res.status(HttpStatus.OK).send(new BaseResponse({}));
  }
}
