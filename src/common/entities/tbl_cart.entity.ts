import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserDb } from "./tbl_user.entity";
import { CartItemDb } from "./tbl_cart_items.entity";

@Entity('tbl_cart')
export class CartDb {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserDb, { onDelete: "CASCADE" })
  @JoinColumn()
  user: UserDb;

  @OneToMany(() => CartItemDb, cartItem => cartItem.cart)
  items: CartItemDb[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

}
