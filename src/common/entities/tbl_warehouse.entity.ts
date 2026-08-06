import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { WarehouseProductDb } from "./tbl_warehouse_products.entity";

@Entity('tbl_warehouse')
export class WarehouseDb {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  lng: number;

  @Column({ type: 'int', default: 24 })
  processingTimeHours: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => WarehouseProductDb, wp => wp.warehouse)
  warehouseProducts: WarehouseProductDb[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
