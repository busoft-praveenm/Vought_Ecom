import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { DbServicesModule } from "@/common/db-services/db-services.module";

@Module({
  imports: [DbServicesModule],
  controllers: [UsersController]
})
export class UsersModule {}
