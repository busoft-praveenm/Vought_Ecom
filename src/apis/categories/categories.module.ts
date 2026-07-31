import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoryDbService } from "@/common/db-services/category-db.service";
import { UserDbService } from "@/common/db-services/user-db.service";
import { RoleDb } from "@/common/entities/tbl_role.entity";

@Module({
  imports: [],
  controllers: [CategoriesController],
  providers: [CategoryDbService, UserDbService]
})
export class CategoriesModule {}
