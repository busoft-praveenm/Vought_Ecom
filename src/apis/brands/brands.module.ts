import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandDbService } from '@/common/db-services/brand-db.service';
import { UserDbService } from '@/common/db-services/user-db.service';
import { RoleDb } from '@/common/entities/tbl_role.entity';

import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'cascade-deletion',
    }),
  ],
  controllers: [BrandsController],
  providers: [BrandDbService, UserDbService]
})
export class BrandsModule {}
