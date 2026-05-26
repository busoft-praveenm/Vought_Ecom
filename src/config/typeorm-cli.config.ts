import { config } from "dotenv";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

config();

export default new DataSource({
  type: "mysql",
  host: process.env.MY_SQL_DB_HOST,
  port: parseInt(process.env.MY_SQL_DB_PORT || "3306"),
  username: process.env.MY_SQL_DB_USER,
  password: process.env.MY_SQL_DB_PASS,
  database: process.env.MY_SQL_DB_NAME,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  migrations: [__dirname + "/../migrations/*{.ts,.js}"],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
});