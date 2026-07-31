import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { OrderDb } from './tbl_order.entity';
import { ProductsDb } from './tbl_products.entity';

@Entity({ name: 'tbl_order_items' })
export class OrderItemDb {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('OrderDb', (order: any) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: OrderDb;

  @ManyToOne(() => ProductsDb)
  @JoinColumn({ name: 'product_id' })
  product: ProductsDb;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
