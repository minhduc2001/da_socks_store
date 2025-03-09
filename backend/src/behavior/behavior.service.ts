import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Behavior } from './entities/behavior.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Product } from '@/product/entities/product.entity';
import { User } from '@/user/entities/user.entity';
import { ERole } from '@/role/enum/roles.enum';

@Injectable()
export class BehaviorService {
  constructor(
    @InjectRepository(Behavior)
    private repository: Repository<Behavior>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createOrUpdate(
    customer_id: number,
    product_id: number,
    quantity: number,
    type: 'views' | 'cart_adds' | 'purchases',
  ) {
    const behavior = await this.repository.findOneBy({ customer_id, product_id });

    const action = async (behavior: Behavior) => {
      if (behavior) {
        behavior[type] += 1;
        await behavior.save();
      } else await this.repository.save({ product_id, customer_id, [type]: quantity });
    };

    return action(behavior);
  }

  findAll() {
    return this.repository.find();
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async exportData() {
    const filePath = path.join(__dirname, '../../../data/behavior_data.csv');

    const data = await this.findAll();
    const csvHeader = 'user_id,product_id,views,cart_adds,purchases\n';

    // Chuyển đổi dữ liệu thành dòng CSV
    const csvRows = data.map(
      b => `${b.customer_id},${b.product_id},${b.views},${b.cart_adds},${b.purchases}`,
    );

    // Ghi dữ liệu vào file
    fs.writeFileSync(filePath, csvHeader + csvRows.join('\n'), 'utf8');
    console.log(filePath);

    return filePath;
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async exportDataProduct() {
    const filePath = path.join(__dirname, '../../../data/products.csv');

    const data = await this.productRepo.find({
      where: { active: true },
      relations: { category: true },
    });
    const csvHeader = 'product_id,name,category,price\n';

    const csvRows = data.map(b => `${b.id},${b.name},${b.category.name},${b.price}`);

    // Ghi dữ liệu vào file
    fs.writeFileSync(filePath, csvHeader + csvRows.join('\n'), 'utf8');
    console.log(filePath);

    return filePath;
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async exportDataUser() {
    const filePath = path.join(__dirname, '../../../data/users.csv');

    const data = await this.userRepo.find({ where: { role: ERole.CUSTOMER } });
    const csvHeader = 'user_id,age,gender,location\n';

    // Chuyển đổi dữ liệu thành dòng CSV
    const csvRows = data.map(
      b => `${b.id},${this.calculateAge(b.birthday)},${b.gender},${b.address}`,
    );

    // Ghi dữ liệu vào file
    fs.writeFileSync(filePath, csvHeader + csvRows.join('\n'), 'utf8');
    console.log(filePath);

    return filePath;
  }

  calculateAge(birthDate: Date): number {
    const bDate = new Date(birthDate).getFullYear();
    const cDate = new Date().getFullYear();
    return cDate - bDate;
  }
}
