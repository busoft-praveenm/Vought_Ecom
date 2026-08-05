import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsController } from './notifications.controller';
import { DbServicesModule } from '@/common/db-services/db-services.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [
    DbServicesModule,
    AuthModule,
    PrismaModule,
    BullModule.registerQueue({
      name: 'notificationsQueue',
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService, NotificationsProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}
