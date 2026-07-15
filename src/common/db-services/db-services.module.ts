import { Module } from "@nestjs/common";
import { UserDb } from "../entities/tbl_user.entity";
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

@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserDb,
      ProductsDb,
      ProductReviewDb,
      CartDb,
      CartItemDb,
      RoleDb
    ])
  ],
  providers: [
    UserDbService, 
    ProductsDbService, 
    ReviewsDbService,
    CartDbService
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
