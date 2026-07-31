import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDb } from '@/common/entities/tbl_order.entity';
import { OrderItemDb } from '@/common/entities/tbl_order_items.entity';
import { CartDb } from '@/common/entities/tbl_cart.entity';
import { CartItemDb } from '@/common/entities/tbl_cart_items.entity';
import { ProductsDb } from '@/common/entities/tbl_products.entity';
import { WarehouseDb } from '@/common/entities/tbl_warehouse.entity';
import { WarehouseProductDb } from '@/common/entities/tbl_warehouse_products.entity';
import { DbServicesModule } from '@/common/db-services/db-services.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDb, OrderItemDb, CartDb, CartItemDb, ProductsDb, WarehouseDb, WarehouseProductDb]),
    DbServicesModule,
    EmailModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
