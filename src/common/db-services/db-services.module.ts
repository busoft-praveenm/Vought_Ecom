import { Module } from "@nestjs/common";
import { UserDbService } from "./user-db.service";
import { ProductsDbService } from "./products-db.service";
import { ReviewsDbService } from "./reviews-db.service";
import { CartDbService } from "./cart-db.service";
import { CategoryDbService } from './category-db.service';
import { BrandDbService } from "./brand-db.service";
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
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
    CategoryDbService,
    BrandDbService
  ],
  exports: [
    UserDbService,
    ProductsDbService,
    ReviewsDbService,
    CartDbService,
    CategoryDbService,
    BrandDbService
  ]
})
export class DbServicesModule{}
