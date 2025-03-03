import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { User } from '@/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart extends AbstractEntity {
  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: false })
  checked_out: boolean;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
  cart_items: CartItem[];
}
