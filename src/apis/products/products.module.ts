import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { DbServicesModule } from "@/common/db-services/db-services.module";
import { ProductsService } from "./products.service";


@Module({
  imports: [DbServicesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: []
})
export class ProductsModule{}