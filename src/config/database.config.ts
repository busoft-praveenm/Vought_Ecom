import { ProductsDb } from "@/common/entities/tbl_products.entity";
import { UserProfileDb } from "@/common/entities/tbl_user_profile.entity";
import { UserDb } from "@/common/entities/tbl_user.entity";
import { ProductReviewDb } from "@/common/entities/tbl_product_review.entity";
import { CartDb } from "@/common/entities/tbl_cart.entity";
import { CartItemDb } from "@/common/entities/tbl_cart_items.entity";
import { RoleDb } from "@/common/entities/tbl_role.entity";
import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";


export const databaseConfig = registerAs(
  "database",
  (): TypeOrmModuleOptions => ({
    type: "mysql",
    host: process.env.MY_SQL_DB_HOST,
    port: parseInt(process.env.MY_SQL_DB_PORT || "3306"),
    username: process.env.MY_SQL_DB_USER,
    password: process.env.MY_SQL_DB_PASS,
    database: process.env.MY_SQL_DB_NAME,
    entities: [UserDb, UserProfileDb, ProductsDb, ProductReviewDb, CartDb, CartItemDb, RoleDb],
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
  })
)