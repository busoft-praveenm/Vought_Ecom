import { Controller, Get, Query, UseGuards, UseInterceptors, Patch, Param, Body, BadRequestException, Inject } from "@nestjs/common";
import { UserDbService } from "@/common/db-services/user-db.service";
import { FirebaseAuthGuard } from "@/guards/firebase.auth.guard";
import { RolesGuard } from "@/guards/roles.guard";
import { Roles } from "@/decorators/roles.decorator";
import { CacheInterceptor, CacheTTL, CACHE_MANAGER } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import type { Cache } from "cache-manager";
import { UserStatus } from "@prisma/client";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SwaggerGetCustomers, SwaggerUpdateUserStatus } from "./users.swagger";

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userDbService: UserDbService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300000)
  @SwaggerGetCustomers()
  @Get('customers')
  async getCustomers(
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.userDbService.getCustomers(Number(page), Number(limit));
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @SwaggerUpdateUserStatus()
  @Patch(':id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: UpdateUserStatusDto,
  ) {
    const status = body.status!;
    const userToUpdate = await this.userDbService.findById(Number(id));
    if (!userToUpdate) {
      throw new BadRequestException('User not found');
    }

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    if (userToUpdate.email === adminEmail && status === UserStatus.INACTIVE) {
      throw new BadRequestException('Cannot deactivate the primary admin user');
    }

    const updatedUser = await this.userDbService.updateUser(Number(id), { status });
    
    // Invalidate cache
    try {
      const cacheManagerAny = this.cacheManager as any;
      const store = cacheManagerAny.store || (cacheManagerAny.stores && cacheManagerAny.stores[0]);
      let keys: string[] = [];
      if (store && typeof store.keys === 'function') {
        keys = await store.keys('*/users/customers*');
      } else if (store && store.client && typeof store.client.keys === 'function') {
        keys = await store.client.keys('*/users/customers*');
      }
      for (const key of keys) {
        await this.cacheManager.del(key);
      }
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
    }
    
    return updatedUser;
  }
}
