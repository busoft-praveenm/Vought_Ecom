import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WarehousesService } from '../apis/warehouses/warehouses.service';
import { ProductsDbService } from '../common/db-services/products-db.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const warehousesService = app.get(WarehousesService);
  const productsDbService = app.get(ProductsDbService);

  console.log('Seeding warehouses...');

  const w1 = await warehousesService.create({
    name: 'Chennai North Hub',
    address: 'Anna Nagar, Chennai, Tamil Nadu',
    lat: 13.0846 as any,
    lng: 80.2179 as any,
    processingTimeHours: 12,
    isActive: true,
  });

  const w2 = await warehousesService.create({
    name: 'Chennai South Hub',
    address: 'OMR, Sholinganallur, Chennai, Tamil Nadu',
    lat: 12.8996 as any,
    lng: 80.2269 as any,
    processingTimeHours: 24,
    isActive: true,
  });

  console.log('Warehouses created.');
  console.log('Distributing product stock...');

  const { results: products } = await productsDbService.getProducts(1, 100);

  for (const product of products) {
    const totalStock = product.stock || Math.floor(Math.random() * 50) + 10;
    
    // Randomly split stock
    const w1Stock = Math.floor(totalStock / 2);
    const w2Stock = totalStock - w1Stock;

    await warehousesService.setInventory(w1.id, product.id, w1Stock);
    await warehousesService.setInventory(w2.id, product.id, w2Stock);

    console.log(`Distributed ${totalStock} stock for ${product.name}`);
  }

  console.log('Seeding complete.');
  await app.close();
}

bootstrap();
