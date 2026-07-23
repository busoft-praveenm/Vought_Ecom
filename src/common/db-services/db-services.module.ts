import { Module } from "@nestjs/common";
import { UserDb } from "../entities/tbl_user.entity";
import { UserProfileDb } from "../entities/tbl_user_profile.entity";
import { RoleDb } from "../entities/tbl_role.entity";
import { UserDbService } from "./user-db.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsDb } from "../entities/tbl_products.entity";
import { ProductsDbService } from "./products-db.service";
import { ProductReviewDb } from "../entities/tbl_product_review.entity";
import { ReviewsDbService } from "./reviews-db.service";
import { CartDb } from "../entities/tbl_cart.entity";
import { CartItemDb } from "../entities/tbl_cart_items.entity";
import { CartDbService } from "./cart-db.service";
import { BrandDb } from "../entities/tbl_brand.entity";
import { CategoryDb } from "../entities/tbl_category.entity";
import { CategoryDbService } from './category-db.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserDb,
      UserProfileDb,
      RoleDb,
      ProductsDb,
      BrandDb,
      CategoryDb,
      CartDb,
      CartItemDb,
      ProductReviewDb
    ]),
    BullModule.registerQueue(
      { name: 'cascade-deletion' },
      { name: 'review-aggregation' }
    )
  ],
  providers: [
    UserDbService, 
    ProductsDbService, 
    ReviewsDbService,
    CartDbService,
    CategoryDbService
  ],
  exports: [
    TypeOrmModule,
    UserDbService,
    ProductsDbService,
    ReviewsDbService,
    CartDbService
  ]
})
export class DbServicesModule{}
