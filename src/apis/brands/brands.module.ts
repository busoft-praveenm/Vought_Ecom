import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandDbService } from '@/common/db-services/brand-db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandDb } from '@/common/entities/tbl_brand.entity';
import { UserDbService } from '@/common/db-services/user-db.service';
import { UserDb } from '@/common/entities/tbl_user.entity';
import { UserProfileDb } from '@/common/entities/tbl_user_profile.entity';
import { RoleDb } from '@/common/entities/tbl_role.entity';

import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrandDb, UserDb, UserProfileDb, RoleDb]),
    BullModule.registerQueue({
      name: 'cascade-deletion',
    }),
  ],
  controllers: [BrandsController],
  providers: [BrandDbService, UserDbService]
})
export class BrandsModule {}
