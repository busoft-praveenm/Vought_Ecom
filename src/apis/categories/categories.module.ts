import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoryDbService } from "@/common/db-services/category-db.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryDb } from "@/common/entities/tbl_category.entity";
import { UserDbService } from "@/common/db-services/user-db.service";
import { UserDb } from "@/common/entities/tbl_user.entity";
import { UserProfileDb } from "@/common/entities/tbl_user_profile.entity";
import { RoleDb } from "@/common/entities/tbl_role.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryDb, UserDb, UserProfileDb, RoleDb])
  ],
  controllers: [CategoriesController],
  providers: [CategoryDbService, UserDbService]
})
export class CategoriesModule {}
