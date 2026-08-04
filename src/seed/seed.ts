import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function seedProducts() {
  const catImage = 'https://as1.ftcdn.net/v2/jpg/03/59/09/04/1000_F_359090423_7kA3WC9HnDEf1I9dx4ccGFhhO90vmzhk.jpg';
  const brandImage = 'https://static.vecteezy.com/system/resources/previews/026/398/902/non_2x/brand-and-trademark-concept-increasing-value-of-goods-and-products-marketing-that-shows-unique-identity-of-product-advertising-business-with-mark-or-logo-design-that-expresses-identity-and-quality-free-photo.jpg';
  const productImage = 'https://xelltechnology.com/wp-content/uploads/2022/04/dummy3.jpg';

  console.log('Clearing existing data...');
  await prisma.productsDb.deleteMany();
  await prisma.brandDb.deleteMany();
  await prisma.categoryDb.deleteMany();
  await prisma.userDb.deleteMany();
  await prisma.roleDb.deleteMany();

  console.log('Seeding roles...');
  await prisma.roleDb.createMany({
    data: [
      { name: 'admin' },
      { name: 'user' }
    ]
  });

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
  for (let i = 1; i <= 50; i++) {
    const name = `Product ${i}`;
    const description = `This is dummy product ${i}`;
    const price = Math.floor(Math.random() * 900) + 10;
    const stock = Math.floor(Math.random() * 100) + 1;
    const sku = `SKU-${Date.now()}-${i}`;
    const productUid = `uid-${Date.now()}-${i}`;
    const brandId = brandIds[i % brandIds.length];

    const numCats = i <= 10 ? 2 : 1; 
    const shuffledCats = [...catIds].sort(() => 0.5 - Math.random());
    const assignedCats = shuffledCats.slice(0, numCats).map(id => ({ id }));

    await prisma.productsDb.create({
      data: {
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
  }

  console.log('Finished seeding database.');
  await prisma.$disconnect();
}

seedProducts().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
