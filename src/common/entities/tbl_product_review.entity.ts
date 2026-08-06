import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Check } from "typeorm";
import { UserDb } from "./tbl_user.entity";
import { ProductsDb } from "./tbl_products.entity";

@Entity('tbl_product_review')
@Check(`"rating" >= 0 AND "rating" <= 5`)
export class ProductReviewDb {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  reviewText: string;

  @ManyToOne(() => UserDb, (user) => user.id, { onDelete: "CASCADE" })
  user: UserDb;

  @ManyToOne(() => ProductsDb, (product) => product.id, { onDelete: "CASCADE" })
  product: ProductsDb;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

}
