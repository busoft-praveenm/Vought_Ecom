import { Controller, Get, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserDbService } from "@/common/db-services/user-db.service";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { RolesGuard } from "@/guards/roles.guard";
import { Roles } from "@/decorators/roles.decorator";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";

@Controller('users')
export class UsersController {
  constructor(private readonly userDbService: UserDbService) {}

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000)
  @Get('customers')
  async getCustomers(
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.userDbService.getCustomers(Number(page), Number(limit));
  }
}
