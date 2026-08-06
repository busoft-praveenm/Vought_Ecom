import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { DbServicesModule } from './common/db-services/db-services.module';
import { AuthModule } from './apis/auth/auth.module';
import { ProductsModule } from './apis/products/products.module';
import { ReviewsModule } from './apis/reviews/reviews.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CartModule } from './apis/cart/cart.module';
import { UsersModule } from './apis/users/users.module';
import { CategoriesModule } from './apis/categories/categories.module';
import { BrandsModule } from './apis/brands/brands.module';
import { JobsModule } from './jobs/jobs.module';
import { OrdersModule } from './apis/orders/orders.module';
import { BullModule } from '@nestjs/bullmq';
import { WarehousesModule } from './apis/warehouses/warehouses.module';
import { EmailModule } from './apis/email/email.module';
import { NotificationsModule } from './apis/notifications/notifications.module';
import { I18nModule, AcceptLanguageResolver, QueryResolver, HeaderResolver } from 'nestjs-i18n';
import * as path from 'path';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    PrismaModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
          }
        }),
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'src/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-custom-lang']),
      ],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    DbServicesModule,
    AuthModule,
    ProductsModule,
    ReviewsModule,
    CartModule,
    UsersModule,
    CategoriesModule,
    BrandsModule,
    JobsModule,
    OrdersModule,
    WarehousesModule,
    EmailModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: []
})
export class AppModule {}
