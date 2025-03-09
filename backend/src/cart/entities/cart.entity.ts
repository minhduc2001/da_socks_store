import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { User } from '@/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Bill } from '@/bill/entities/bill.entity';

@Entity()
export class Cart extends AbstractEntity {
  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: false })
  checked_out: boolean;

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  cart_items: CartItem[];

  @OneToOne(() => Bill, bill => bill.cart)
  bill: Bill;
}
