import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { ProductOrder } from 'src/entities/product-order';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductOrder)
    private productOrderRepo: Repository<ProductOrder>,
  ) {}

  async test() {
    const partnerCode = 'MOMO';
    const accessKey = 'F8BBA842ECF85';
    const secretkey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const orderInfo = 'pay with MoMo';
    const redirectUrl = 'https://momo.vn/return';
    const ipnUrl = 'https://callback.url/notify';
    // const ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    const amount = '1000';
    const requestType = 'captureWallet';
    const extraData = ''; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
    //puts raw signature
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);

    var signature = crypto
      .createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'en',
    });
    //Create the HTTPS objects
    const https = require('https');
    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };
    console.log(
      ':Buffer.byteLength(requestBody):',
      Buffer.byteLength(requestBody),
    );
    //Send the request and get the response
    const req = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (body) => {
        console.log('Body: ');
        console.log(body);
        console.log('payUrl: ');
        console.log(JSON.parse(body).payUrl);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });

    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    console.log('Sending....');
    req.write(requestBody);
    req.end();

    return 'test';
  }

  async getAllForAdmin() {
    return await this.orderRepo.find({
      relations: {
        product_order: true,
        user: true,
      },
      order: {
        status: 'ASC',
      },
    });
  }

  async create(userId: number, createOrderDto: any) {
    const { list, info } = createOrderDto;

    console.log({ list, info });
    const order = new Order();
    const totalPrice = list.reduce(
      (accumulator: any, currentValue: any) =>
        (accumulator += currentValue.price * currentValue.quantity),
      0,
    );

    order.orderDate = new Date();
    order.total = totalPrice;
    order.fullName = info.fullName;
    order.address = info.address;
    order.phone = info.phone;

    const newOrder = this.orderRepo.create({
      ...order,
      user: { id: userId },
    });

    await this.orderRepo.save(newOrder);

    await this.productOrderRepo
      .createQueryBuilder()
      .insert()
      .values(
        list.map((item: ProductOrder) => ({
          ...item,
          order: { id: newOrder.id },
          quantity: item.quantity,
        })),
      )
      .execute();
    return;
    // order.products = products;
  }

  async findAll(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 0 },
      relations: { product_order: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOrderAccepted(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 1 },
      relations: { product_order: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findAllRejected(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 2 },
      relations: { product_order: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findAllDone(userId: number) {
    return await this.orderRepo.find({
      where: { user: { id: userId }, status: 3 },
      relations: { product_order: true },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return await this.orderRepo.findOne({
      where: { id },
      relations: { user: true, product_order: true },
    });
  }

  async reject(id: number, body: any) {
    const order = await this.orderRepo.findOneBy({ id });
    order.status = 2; // hủy đơn
    order.reason = body.reason; //lý do
    await this.orderRepo.save(order);
    return;
  }

  async changeStatus(id: number, date: string) {
    await this.orderRepo.update(
      {
        id,
      },
      {
        status: 1,
        dateExcepted: date,
        dateAccept: moment(),
      },
    );
  }
}
