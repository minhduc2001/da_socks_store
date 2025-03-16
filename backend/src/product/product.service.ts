import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseService } from '@/base/service/base.service';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaginateConfig } from '@/base/service/paginate/paginate';
import { ListDto } from '@/shared/dtos/common.dto';
import { ProductVariant } from './entities/product-variant.entity';
import { Category } from '@/category/entities/category.entity';
import { BehaviorService } from '@/behavior/behavior.service';
import { User } from '@/user/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    protected repository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    private behaviorService: BehaviorService,
    private httpService: HttpService,
  ) {
    super(repository);
  }
  async create(payload: CreateProductDto) {
    const { variants, ...rest } = payload;
    const product = await this.repository.save({
      ...rest,
      category: { id: rest.category_id } as Category,
    });

    const saves = await this.productVariantRepository.save(variants.map(v => ({ ...v, product })));

    return { ...product, variants: saves };
  }

  findAll(query: ListDto) {
    const config: PaginateConfig<Product> = {
      sortableColumns: ['updated_at'],
      defaultSortBy: [['updated_at', 'DESC']],
      relations: ['category', 'variants'],
      searchableColumns: ['name', 'category.name'],
    };
    return this.listWithPage(query, config);
  }

  listClient(query: ListDto) {
    const config: PaginateConfig<Product> = {
      sortableColumns: ['updated_at'],
      defaultSortBy: [['updated_at', 'DESC']],
      relations: ['category', 'variants'],
      searchableColumns: ['name', 'category.name'],
    };
    return this.listWithPage(query, config);
  }

  async listRecommend(query: ListDto, user: User) {
    const { data } = await firstValueFrom(
      this.httpService.get(`http://localhost:5000/recommend?user_id=${user.id}`),
    );

    if (!data) return [];
    const products = await this.repository.find({ where: { id: In(data) } });

    return products;
  }

  async listViews() {
    return this.repository.createQueryBuilder('p').orderBy('views', 'DESC').limit(10).getMany();
  }

  async listBuy() {
    return this.repository.createQueryBuilder('p').orderBy('buy', 'DESC').limit(10).getMany();
  }

  async findOne(id: number, user: User) {
    const product = await this.repository.findOne({
      where: { id },
      relations: { category: true, variants: true },
    });

    await this.behaviorService.createOrUpdate(user.id, product.id, 1, 'views');
    return product;
  }

  async findOneClient(id: number) {
    const product = await this.repository.findOne({
      where: { id },
      relations: { category: true, variants: true },
    });

    product.views += 1;
    product.save();
    return product;
  }

  async update(id: number, payload: UpdateProductDto) {
    const { variants, category_id, ...rest } = payload;
    const variantsDB = await this.productVariantRepository.find({
      where: { product: { id } },
      select: ['id'],
    });

    for (const variant of variants) {
      if (!variant?.id) {
        await this.productVariantRepository.save({ ...variant, product: { id } as Product });
        continue;
      }
      if (variant.id && variantsDB.find(vDb => vDb.id == variant.id)) {
        await this.productVariantRepository.update(variant.id, { ...variant });
        continue;
      } else if (variant.id && !variantsDB.find(vDb => vDb.id == variant.id)) {
        await this.productVariantRepository.delete(variant.id);
      }
    }

    return this.repository.update(id, { ...rest, category: { id: category_id } as Category });
  }

  active(id: number, active: boolean) {
    return this.repository.update(id, { active });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
