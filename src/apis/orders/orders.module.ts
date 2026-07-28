import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDb } from '@/common/entities/tbl_order.entity';
import { OrderItemDb } from '@/common/entities/tbl_order_items.entity';
import { CartDb } from '@/common/entities/tbl_cart.entity';
import { CartItemDb } from '@/common/entities/tbl_cart_items.entity';
import { ProductsDb } from '@/common/entities/tbl_products.entity';
import { DbServicesModule } from '@/common/db-services/db-services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDb, OrderItemDb, CartDb, CartItemDb, ProductsDb]),
    DbServicesModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
