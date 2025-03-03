import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { User } from '@/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BillStatus } from '../bill.constant';
import { BillItem } from './bill-item.entity';

@Entity()
export class Bill extends AbstractEntity {
  @ManyToOne(() => User, user => user.id, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => BillItem, bI => bI.bill)
  bill_items: BillItem[];

  @Column()
  total: number;

  @Column({ type: 'enum', enum: BillStatus, default: BillStatus.pending })
  status: BillStatus;
}
