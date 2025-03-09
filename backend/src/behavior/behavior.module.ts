import { Global, Module } from '@nestjs/common';
import { BehaviorService } from './behavior.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Behavior } from './entities/behavior.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from '@/user/entities/user.entity';
import { Product } from '@/product/entities/product.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Behavior, User, Product]), ScheduleModule.forRoot()],
  providers: [BehaviorService],
  exports: [BehaviorService],
})
export class BehaviorModule {}
