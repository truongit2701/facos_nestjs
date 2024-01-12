import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSize } from 'src/entities/product-size.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductSize)
    private productSizeRepo: Repository<ProductSize>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const {
      title,
      price,
      description,
      category,
      style,
      image,
      size,
      in_stock,
    } = createProductDto;

    const code = Math.random() * 10000000;
    const code_format = code.toFixed(0);

    const new_product = await this.productRepo
      .create({
        image,
        price,
        description,
        category,
        style,
        title,
        code: +code_format,
      })
      .save();

    // save product size

    const data_size_insert = size.map((size_id: any) => {
      return {
        product: { id: new_product.id },
        size: size_id,
        stock_quantity: in_stock[size_id],
      };
    });
    await this.productSizeRepo.insert(data_size_insert);
    return new_product;
  }

  async findNewProduct() {
    return this.productRepo
      .createQueryBuilder('p')
      .take(8)
      .orderBy('p.created_at', 'DESC')
      .where('p.status = :status', { status: 1 })
      .getMany();
  }

  async findAll(query: any) {
    const querySQL = this.productRepo.createQueryBuilder('p');

    const keySearch = query?.key_search || '';
    const category = query?.category;
    querySQL.where('p.title LIKE :keyword', { keyword: `%${keySearch}%` });
    category && querySQL.andWhere('p.category = :category', { category });
    querySQL.orderBy('p.created_at', 'DESC');
    querySQL.leftJoinAndSelect('p.product_sizes', 'product_size');
    querySQL.leftJoinAndSelect('product_size.size', 'size');
    querySQL.andWhere('p.status = :status', { status: 1 });

    const products = await querySQL.getMany();

    return products;
  }

  async findOne(id: number) {
    return await this.productRepo.findOne({
      where: { id },
      relations: ['product_sizes', 'product_sizes.size'],
    });
  }

  async findAllAdmin() {
    const productList = await this.productRepo
      .createQueryBuilder('product')
      .orderBy('created_at', 'DESC')
      .leftJoinAndSelect('product.product_sizes', 'p_s')
      .leftJoinAndSelect('p_s.size', 'size')
      .where('product.status = :status', { status: 1 })
      .getMany();

    return productList;
  }

  async update(id: number, body: any) {
    const {
      title,
      price,
      image,
      description,
      category,
      style,
      size,
      in_stock,
    } = body;
    const product = await this.productRepo.findOne({
      where: { id },
      relations: { product_sizes: true },
    });

    product.title = title;
    product.category = category;
    product.price = price;
    product.image = image;
    product.description = description;
    product.style = style;

    await this.productRepo.save(product);

    await this.productSizeRepo.delete({ product: { id: product.id } });

    const data_size_insert = size.map((size_id: number) => {
      return {
        product: { id: product.id },
        size: size_id,
        stock_quantity: in_stock[size_id],
      };
    });
    await this.productSizeRepo.insert(data_size_insert);

    return;
  }

  async remove(id: number) {
    await this.productRepo.update({ id }, { status: 0 });
    return;
  }
}
