import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSize } from 'src/entities/product-size.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Promotion } from 'src/entities';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductSize)
    private productSizeRepo: Repository<ProductSize>,
  ) {}

  generateSKU(product: any) {
    // Lấy các thuộc tính của sản  phẩm
    const { id, title, category } = product;

    // Xử lý và tạo SKU
    const formattedTitle = title.replace(/\s+/g, '-').toLowerCase(); // Chuẩn hóa tiêu đề
    const formattedCategory = category.replace(/\s+/g, '-').toLowerCase(); // Chuẩn hóa danh mục
    const sku = `${formattedCategory}-${formattedTitle}-${id}`; // Kết hợp các giá trị để tạo SKU

    return sku;
  }

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

    const new_product = await this.productRepo
      .create({
        image,
        price,
        description,
        category,
        style,
        title,
      })
      .save();

    const code = this.generateSKU({ id: new_product.id, title, category });

    // save product size

    const data_size_insert = size.map((size_id: any) => {
      return {
        product: { id: new_product.id },
        size: size_id,
        stock_quantity: in_stock[size_id],
      };
    });
    await this.productSizeRepo.insert(data_size_insert);

    await this.productRepo.update({ id: new_product.id }, { code: code });
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
    querySQL.leftJoinAndSelect('p.promotion', 'promotion');

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

    // for (const p of productList) {
    //   await this.productRepo.update(
    //     { id: p.id },
    //     {
    //       code: this.generateSKU({
    //         id: p.id,
    //         title: p.title,
    //         category: p.category,
    //       }),
    //     },
    //   );
    // }

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

  async changeStock(id: number, body: any) {
    await this.productRepo.update({ id }, { stocking: Number(!body.in_stock) });
    return;
  }
}
