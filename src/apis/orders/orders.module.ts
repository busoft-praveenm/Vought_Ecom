import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DbServicesModule } from '@/common/db-services/db-services.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    DbServicesModule,
    EmailModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
