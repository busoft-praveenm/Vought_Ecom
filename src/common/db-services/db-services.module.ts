import { Module } from "@nestjs/common";
import { UserDb } from "../entities/tbl_user.entity";
import { UserDbService } from "./user-db.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsDb } from "../entities/tbl_products.entity";
import { ProductsDbService } from "./products-db.service";

@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserDb,
      ProductsDb
    ])
  ],
  providers: [UserDbService, ProductsDbService],
  exports: [
    TypeOrmModule,
    UserDbService,
    ProductsDbService
  ]
})
export class DbServicesModule{}
