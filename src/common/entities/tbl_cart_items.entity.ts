import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CartDb } from "./tbl_cart.entity";
import { ProductsDb } from "./tbl_products.entity";

@Entity('tbl_cart_items')
export class CartItemDb {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartDb, { onDelete: "CASCADE" })
  cart: CartDb;

  @ManyToOne(() => ProductsDb, { onDelete: "CASCADE" })
  product: ProductsDb;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

}
