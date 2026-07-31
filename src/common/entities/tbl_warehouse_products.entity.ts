import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { WarehouseDb } from "./tbl_warehouse.entity";
import { ProductsDb } from "./tbl_products.entity";

@Entity('tbl_warehouse_products')
export class WarehouseProductDb {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @ManyToOne(() => WarehouseDb, warehouse => warehouse.warehouseProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseDb;

  @ManyToOne(() => ProductsDb, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: ProductsDb;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
