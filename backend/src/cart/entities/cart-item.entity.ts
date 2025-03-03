import { User } from '@/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from '@/product/entities/product-variant.entity';
import { AbstractEntity } from '@/base/service/abstract-entity.service';

@Entity()
export class CartItem extends AbstractEntity {
  @ManyToOne(() => Cart, cart => cart.cart_items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => ProductVariant, variant => variant.id, { onDelete: 'CASCADE' })
  variant: ProductVariant;

  @Column()
  quantity: number;
}
