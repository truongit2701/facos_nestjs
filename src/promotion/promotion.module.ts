import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, Promotion } from 'src/entities';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promotion, Product]),
    ScheduleModule.forRoot(),
  ],
  controllers: [PromotionController],
  providers: [PromotionService, SchedulerRegistry],
})
export class PromotionModule {}
