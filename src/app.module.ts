import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AT_SECRET } from './auth/types';
import { AtGuard } from './common/guards';
import { User } from './entities/auth.entity';
import { Discount } from './entities/discount.entity';
import { FeedBack } from './entities/feedback.entity';
import { Notify } from './entities/notify.entity';
import { Order } from './entities/order.entity';
import { ProductOrder } from './entities/product-order';
import { ProductSize } from './entities/product-size.entity';
import { Product } from './entities/product.entity';
import { Size } from './entities/size.entity';
import { NotiToken } from './entities/token-firebase';
import { FeedbackModule } from './feedback/feedback.module';
import { IncomeModule } from './income/income.module';
import { NotificationModule } from './notification/notification.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { SizeModule } from './size/size.module';
import { DiscountModule } from './discount/discount.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.CONFIG_POSTGRES_HOST,
      port: +process.env.CONFIG_POSTGRES_PORT,
      username: process.env.CONFIG_POSTGRES_USER,
      password: process.env.CONFIG_POSTGRES_PASSWORD,
      database: process.env.CONFIG_DATABASE_NAME,
      entities: [
        User,
        Product,
        Size,
        ProductSize,
        Order,
        ProductOrder,
        FeedBack,
        Notify,
        NotiToken,
        Discount,
      ],
      synchronize: true,
    }),
    AuthModule,
    ProductModule,
    JwtModule.register({
      secret: AT_SECRET, // Thay thế bằng secret key thực tế của bạn
    }),
    SizeModule,
    OrderModule,
    FeedbackModule,
    IncomeModule,
    NotificationModule,
    DiscountModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
