import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserDb } from './tbl_user.entity';
import { OrderItemDb } from './tbl_order_items.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

@Entity({ name: 'tbl_order' })
export class OrderDb {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserDb)
  @JoinColumn({ name: 'user_id' })
  user: UserDb;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ name: 'razorpay_order_id', type: 'varchar', nullable: true })
  razorpayOrderId: string;

  @Column({ name: 'razorpay_payment_id', type: 'varchar', nullable: true })
  razorpayPaymentId: string;

  @Column({ name: 'razorpay_signature', type: 'varchar', nullable: true })
  razorpaySignature: string;

  @OneToMany(() => OrderItemDb, (orderItem) => orderItem.order)
  items: OrderItemDb[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
