import { PrismaService } from '@/prisma/prisma.service';

export async function clearDatabase(prisma: PrismaService) {
  // Ordered by dependencies to avoid foreign key constraint errors
  const tableNames = [
    '_product_categories',
    'tbl_order_items',
    'tbl_product_review',
    'tbl_cart_items',
    'tbl_cart',
    'tbl_order',
    'tbl_products',
    'tbl_category',
    'tbl_brand',
    'tbl_warehouse_products',
    'tbl_warehouse',
    'tbl_user_profile',
    'tbl_user',
    'tbl_role',
  ];

  for (const tableName of tableNames) {
    try {
      await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${tableName}\`;`);
      await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
    } catch (error) {
      console.log(`Failed to truncate ${tableName}:`, error);
    }
  }
}
