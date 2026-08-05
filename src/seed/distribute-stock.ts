import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function distributeStock() {
  console.log('Starting stock distribution...');

  // 1. Clear blocking data (orders, carts, inventory locks)
  console.log('Clearing orders, cart items, and inventory locks...');
  await prisma.inventoryLockDb.deleteMany();
  await prisma.orderItemDb.deleteMany();
  await prisma.orderDb.deleteMany();
  await prisma.cartItemDb.deleteMany();
  await prisma.cartDb.deleteMany();

  // 2. Clear existing warehouse product entries
  console.log('Clearing existing warehouse stock...');
  await prisma.warehouseProductDb.deleteMany();

  // 3. Get all active warehouses
  const warehouses = await prisma.warehouseDb.findMany();
  if (warehouses.length === 0) {
    console.error('No warehouses found! Please create warehouses first.');
    process.exit(1);
  }
  console.log(`Found ${warehouses.length} warehouses.`);

  // 4. Get all products
  const products = await prisma.productsDb.findMany();
  console.log(`Found ${products.length} products.`);

  // 5. Distribute stock
  for (const product of products) {
    const totalStock = product.stock;
    if (totalStock <= 0) continue;

    const baseStockPerWarehouse = Math.floor(totalStock / warehouses.length);
    let remainder = totalStock % warehouses.length;

    for (let i = 0; i < warehouses.length; i++) {
      const warehouse = warehouses[i];
      let stockToAssign = baseStockPerWarehouse;
      if (remainder > 0) {
        stockToAssign += 1;
        remainder -= 1;
      }

      if (stockToAssign > 0) {
        await prisma.warehouseProductDb.create({
          data: {
            warehouseId: warehouse.id,
            productId: product.id,
            quantity: stockToAssign,
          }
        });
      }
    }
  }

  // 6. Verify aggregate stock
  for (const product of products) {
    const allWarehouseProducts = await prisma.warehouseProductDb.findMany({
      where: { productId: product.id },
    });
    
    const calculatedTotalStock = allWarehouseProducts.reduce((sum, wp) => sum + wp.quantity, 0);
    
    if (calculatedTotalStock !== product.stock) {
        console.warn(`Mismatch for product ${product.id}: expected ${product.stock}, got ${calculatedTotalStock}. Fixing aggregate...`);
        await prisma.productsDb.update({
            where: { id: product.id },
            data: { stock: calculatedTotalStock }
        });
    }
  }

  console.log('Stock distribution completed successfully!');
  await prisma.$disconnect();
}

distributeStock().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
