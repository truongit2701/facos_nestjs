import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { ProductModule } from './product/product.module';
import { Product } from './entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { AT_SECRET } from './auth/types';
import { SizeModule } from './size/size.module';
import { Size } from './entities/size.entity';
import { ProductSize } from './entities/product-size.entity';
import { Order } from './entities/order.entity';
import { OrderModule } from './order/order.module';
import { ProductOrder } from './entities/product-order';
import { FeedbackModule } from './feedback/feedback.module';
import { FeedBack } from './entities/feedback.entity';
import { IncomeModule } from './income/income.module';
import { NotificationController } from './notification/notification.controller';
import { Notify } from './entities/notify.entity';
import { NotificationService } from './notification/notification.service';
import { NotificationModule } from './notification/notification.module';
import { NotiToken } from './entities/token-firebase';

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
