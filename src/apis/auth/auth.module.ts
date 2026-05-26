import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { DbServicesModule } from "@/common/db-services/db-services.module";
import { FirebaseAuthService } from "@/guards/firebase.auth.guard";
import { AuthController } from "./auth.controller";


@Module({
  imports: [DbServicesModule],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, FirebaseAuthService]
})
export class AuthModule{}