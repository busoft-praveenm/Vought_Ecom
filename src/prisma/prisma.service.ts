import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    const url = process.env.NODE_ENV === 'test'
      ? 'mysql://agira:Agira@123@localhost:3306/vought_ecom_test'
      : configService.get<string>('DATABASE_URL');
    console.log('PRISMA CONNECTING TO URL:', url);
    super({
      datasources: {
        db: {
          url: url,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
