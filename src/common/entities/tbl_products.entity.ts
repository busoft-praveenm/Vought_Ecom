import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, ManyToMany, JoinTable, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserDb } from "./tbl_user.entity";
import { CategoryDb } from "./tbl_category.entity";
import { BrandDb } from "./tbl_brand.entity";

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

  @ManyToMany(() => CategoryDb, category => category.products, { nullable: true })
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories: CategoryDb[];

  @ManyToOne(() => BrandDb, brand => brand.products, { nullable: true })
  brand: BrandDb;

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