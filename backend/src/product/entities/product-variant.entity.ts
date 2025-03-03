import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { BillItem } from '@/bill/entities/bill-item.entity';

@Entity()
export class ProductVariant extends AbstractEntity {
  @ManyToOne(() => Product, product => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ default: '' })
  image: string;

  @Column()
  type: string;

  @Column({ default: 0 })
  stock: number;

  @OneToMany(() => BillItem, b => b.variant)
  bill_items: BillItem[];
}
