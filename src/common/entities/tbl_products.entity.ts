import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserDb } from "./tbl_user.entity";
import { CategoryDb } from "./tbl_category.entity";

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

@Entity('tbl_products')
export class ProductsDb {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  product_uid: string;

  @Column()
  name: string;

  @Column({ unique: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => CategoryDb, category => category.products, { nullable: true })
  category: CategoryDb;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true, type: 'text'})
  imageUrl: string;

  @Column({ type: "enum", enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @ManyToOne(()=>UserDb, (createdBy)=>createdBy.id, { onDelete: "CASCADE", nullable: true })
  createdBy: UserDb;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

}