import { UserDb } from "@/common/entities/tbl_user.entity";
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
    entities: [UserDb],
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
  })
)