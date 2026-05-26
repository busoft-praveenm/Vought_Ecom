import { Module } from "@nestjs/common";
import { UserDb } from "../entities/tbl_user.entity";
import { UserDbService } from "./user-db.service";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserDb
    ])
  ],
  providers: [UserDbService],
  exports: [
    TypeOrmModule,
    UserDbService
  ]
})
export class DbServicesModule{}
