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
    const { title, price, description, category, style, image, size } =
      createProductDto;

    const code = title;

    const sizes = JSON.stringify(size.map((item: any) => item.value));
    const newProduct = await this.productRepo
      .create({
        image,
        price,
        description,
        category,
        style,
        title,
        code,
        sizes,
      })
      .save();

    return newProduct;
  }

  async findNewProduct() {
    return this.productRepo
      .createQueryBuilder()
      .limit(8)
      .orderBy('created_at', 'DESC')
      .getMany();
  }

  async findAll(query: any) {
    const querySQL = this.productRepo.createQueryBuilder('p');

    const keySearch = query?.key_search || '';
    querySQL.where('p.title LIKE :keyword', { keyword: `%${keySearch}%` });
    querySQL.orderBy('p.created_at', 'DESC');

    const products = await querySQL.getMany();

    return products;
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    const size = await this.productSizeRepo.find({
      where: { product: { id } },
      relations: { size: true },
    });

    return {
      ...product,
      size: size.map((item) => {
        return {
          ...item.size,
          label: item.size.value,
        };
      }),
    };
  }

  async findAllAdmin() {
    const productList = await this.productRepo
      .createQueryBuilder('product')
      .orderBy('created_at', 'DESC')
      .getMany();

    return productList;
  }

  async update(id: number, body: any) {
    const { title, price, image, description, category, style, sizes } = body;

    const sizeMap = sizes.map((item) => item.label);

    const product: Product = await this.productRepo.findOne({ where: { id } });

    product.title = title;
    product.category = category;
    product.price = price;
    product.image = image;
    product.description = description;
    product.style = style;
    product.sizes = JSON.stringify(sizeMap);

    await this.productRepo.save(product);

    return;
  }

  async remove(id: number) {
    await this.productSizeRepo
      .createQueryBuilder()
      .delete()
      .from(ProductSize)
      .where({ product: { id } })
      .execute();
    await this.productSizeRepo
      .createQueryBuilder()
      .delete()
      .from(Product)
      .where({ id })
      .execute();
    return;
  }
}
