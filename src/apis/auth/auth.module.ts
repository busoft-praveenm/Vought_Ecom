import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { DbServicesModule } from "@/common/db-services/db-services.module";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { AuthController } from "./auth.controller";


@Module({
  imports: [DbServicesModule],
  controllers: [AuthController],
  exports: [AuthService, FirebaseAuthGuard],
  providers: [AuthService, FirebaseAuthGuard]
})
export class AuthModule{}