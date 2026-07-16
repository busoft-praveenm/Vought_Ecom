import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cacheManager = app.get(CACHE_MANAGER);
  
  await cacheManager.set('/products?page=1&limit=10&search=', 'testdata');
  const keys = await (cacheManager.store as any).keys('*');
  console.log('Keys:', keys);
  
  await app.close();
}

bootstrap().catch(console.error);
