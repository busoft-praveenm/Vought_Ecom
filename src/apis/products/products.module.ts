import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { DbServicesModule } from "@/common/db-services/db-services.module";
import { ProductsService } from "./products.service";


import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    DbServicesModule,
    BullModule.registerQueue({
      name: 'cache-invalidation',
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: []
})
export class ProductsModule{}