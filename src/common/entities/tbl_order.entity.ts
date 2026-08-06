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
import type { UserDb } from './tbl_user.entity';
import type { OrderItemDb } from './tbl_order_items.entity';
import type { WarehouseDb } from './tbl_warehouse.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  ORDER_PLACED = 'ORDER_PLACED',
  PACKAGING_DONE = 'PACKAGING_DONE',
  ASSIGNED_DELIVERY_AGENT = 'ASSIGNED_DELIVERY_AGENT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
}

@Entity({ name: 'tbl_order' })
export class OrderDb {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('UserDb')
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

  @OneToMany('OrderItemDb', (orderItem: any) => orderItem.order)
  items: OrderItemDb[];

  @ManyToOne('WarehouseDb', { nullable: true })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseDb;

  @Column({ name: 'expected_delivery_date', type: 'timestamp', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ name: 'distance_km', type: 'decimal', precision: 10, scale: 2, nullable: true })
  distanceKm: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
