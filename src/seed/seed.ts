import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function seedProducts() {
  const catImage = 'https://as1.ftcdn.net/v2/jpg/03/59/09/04/1000_F_359090423_7kA3WC9HnDEf1I9dx4ccGFhhO90vmzhk.jpg';
  const brandImage = 'https://static.vecteezy.com/system/resources/previews/026/398/902/non_2x/brand-and-trademark-concept-increasing-value-of-goods-and-products-marketing-that-shows-unique-identity-of-product-advertising-business-with-mark-or-logo-design-that-expresses-identity-and-quality-free-photo.jpg';
  const productImage = 'https://xelltechnology.com/wp-content/uploads/2022/04/dummy3.jpg';

  console.log('Clearing existing data...');
  // Delete in correct order to avoid foreign key constraints
  await prisma.notificationDb.deleteMany();
  await prisma.inventoryLockDb.deleteMany();
  await prisma.orderItemDb.deleteMany();
  await prisma.orderDb.deleteMany();
  await prisma.cartItemDb.deleteMany();
  await prisma.cartDb.deleteMany();
  await prisma.warehouseProductDb.deleteMany();
  await prisma.warehouseDb.deleteMany();
  await prisma.productReviewDb.deleteMany();
  await prisma.productsDb.deleteMany();
  await prisma.brandDb.deleteMany();
  await prisma.categoryDb.deleteMany();
  await prisma.userProfileDb.deleteMany();
  await prisma.userDb.deleteMany();
  await prisma.roleDb.deleteMany();

  console.log('Seeding roles...');
  // Explicit IDs to match our dumped data
  await prisma.roleDb.create({ data: { id: 1, name: 'admin' } });
  await prisma.roleDb.create({ data: { id: 2, name: 'user' } });

  console.log('Seeding users and profiles...');
  const usersDataPath = path.join(__dirname, 'data/users.json');
  if (fs.existsSync(usersDataPath)) {
    const usersData = JSON.parse(fs.readFileSync(usersDataPath, 'utf8'));
    for (const user of usersData) {
      const { profile, ...userData } = user;
      await prisma.userDb.create({
        data: {
          ...userData,
          profile: profile ? {
            create: {
              firstName: profile.firstName,
              lastName: profile.lastName,
              mobileNumber: profile.mobileNumber,
              billingAddress: profile.billingAddress,
              deliveryAddress: profile.deliveryAddress,
              deliveryLat: profile.deliveryLat,
              deliveryLng: profile.deliveryLng,
              createdAt: profile.createdAt,
              updatedAt: profile.updatedAt
            }
          } : undefined
        }
      });
    }
  } else {
    console.warn('data/users.json not found. Skipping user seeding.');
  }

  console.log('Seeding brands...');
  const brandIds: number[] = [];
  const brandNames = [
    'Vought International', 'Starlight Tech', 'Seven Home', 'A-Train Sports', 'Deep Aqua',
    'Maeve Beauty', 'Noir Stealth', 'Homelander Capes', 'Translucent Glass', 'Queen Maeve Fitness',
    'Stormfront Tech', 'Black Noir Knives', 'Lamplighter Torches', 'Eagle the Archer Bows', 'Ashley PR'
  ];
  for (const name of brandNames) {
    const brand = await prisma.brandDb.create({
      data: {
        name,
        description: `Premium products from ${name}`,
        imageUrl: brandImage,
        isActive: true,
      }
    });
    brandIds.push(brand.id);
  }

  console.log('Seeding categories...');
  const catIds: number[] = [];
  const catNames = [
    'Electronics', 'Home & Kitchen', 'Sports', 'Toys', 'Fashion',
    'Books', 'Automotive', 'Beauty', 'Health', 'Pet Supplies',
    'Garden', 'Outdoors', 'Groceries', 'Baby', 'Tools',
    'Office Supplies', 'Musical Instruments', 'Software', 'Industrial', 'Handmade'
  ];
  for (const name of catNames) {
    const cat = await prisma.categoryDb.create({
      data: {
        name,
        description: `Awesome ${name}`,
        imageUrl: catImage,
        isActive: true,
      }
    });
    catIds.push(cat.id);
  }

  console.log('Seeding 50 products...');
  const createdProducts: any[] = [];
  for (let i = 1; i <= 50; i++) {
    const name = `Product ${i}`;
    const description = `This is dummy product ${i}`;
    const price = Math.floor(Math.random() * 900) + 10;
    // We set stock to 0 initially. The warehouse logic will update it.
    const stock = 0; 
    const sku = `SKU-${Date.now()}-${i}`;
    const productUid = `uid-${Date.now()}-${i}`;
    const brandId = brandIds[i % brandIds.length];

    const numCats = i <= 10 ? 2 : 1; 
    const shuffledCats = [...catIds].sort(() => 0.5 - Math.random());
    const assignedCats = shuffledCats.slice(0, numCats).map(id => ({ id }));

    const p = await prisma.productsDb.create({
      data: {
        // Force the ID to match 1 to 50 exactly so the warehouse products align
        id: i,
        name,
        description,
        price,
        stock,
        sku,
        productUid,
        imageUrl: productImage,
        brandId,
        isDeleted: false,
        categories: {
          connect: assignedCats
        }
      }
    });
    createdProducts.push(p);
  }

  console.log('Seeding warehouses and inventory...');
  const warehousesDataPath = path.join(__dirname, 'data/warehouses.json');
  if (fs.existsSync(warehousesDataPath)) {
    const warehousesData = JSON.parse(fs.readFileSync(warehousesDataPath, 'utf8'));
    for (const warehouse of warehousesData) {
      const { warehouseProducts, ...warehouseData } = warehouse;
      await prisma.warehouseDb.create({
        data: {
          ...warehouseData,
          warehouseProducts: warehouseProducts ? {
            create: warehouseProducts.map((wp: any) => ({
              quantity: wp.quantity,
              productId: wp.productId,
              createdAt: wp.createdAt,
              updatedAt: wp.updatedAt
            }))
          } : undefined
        }
      });
    }

    // Now recalculate the aggregate stock for all products
    for (const p of createdProducts) {
      const allWarehouseProducts = await prisma.warehouseProductDb.findMany({
        where: { productId: p.id },
      });
      const totalStock = allWarehouseProducts.reduce((sum, wp) => sum + wp.quantity, 0);
      await prisma.productsDb.update({
        where: { id: p.id },
        data: { stock: totalStock }
      });
    }
  } else {
    console.warn('data/warehouses.json not found. Skipping warehouse seeding.');
  }

  console.log('Finished seeding database.');
  await prisma.$disconnect();
}

seedProducts().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
