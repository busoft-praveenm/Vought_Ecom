import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { DbServicesModule } from "@/common/db-services/db-services.module";

@Module({
  imports: [DbServicesModule],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
