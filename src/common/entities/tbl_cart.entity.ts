import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserDb } from "./tbl_user.entity";

@Entity('tbl_cart')
export class CartDb {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserDb, { onDelete: "CASCADE" })
  @JoinColumn()
  user: UserDb;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

}
