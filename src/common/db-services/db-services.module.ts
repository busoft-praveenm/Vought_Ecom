import { Module } from "@nestjs/common";
import { UserDb } from "../entities/tbl_user.entity";
import { UserDbService } from "./user-db.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsDb } from "../entities/tbl_products.entity";
import { ProductsDbService } from "./products-db.service";
import { ProductReviewDb } from "../entities/tbl_product_review.entity";
import { ReviewsDbService } from "./reviews-db.service";

@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserDb,
      ProductsDb,
      ProductReviewDb
    ])
  ],
  providers: [
    UserDbService, 
    ProductsDbService, 
    ReviewsDbService
  ],
  exports: [
    TypeOrmModule,
    UserDbService,
    ProductsDbService,
    ReviewsDbService
  ]
})
export class DbServicesModule{}
