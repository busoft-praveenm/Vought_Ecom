const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const query = "Product 38";
  
  // Natural
  const res1 = await prisma.productsDb.findMany({
    where: { OR: [ { name: { search: query }, description: { search: query } } ] },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log("Natural (returns newest):", res1.map(r => r.name));

  // Boolean with +
  const booleanQuery = query.trim().split(/\s+/).map(word => `+${word}*`).join(' ');
  console.log("Boolean query:", booleanQuery);
  const res2 = await prisma.productsDb.findMany({
    where: { OR: [ { name: { search: booleanQuery }, description: { search: booleanQuery } } ] },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log("Boolean (+word*):", res2.map(r => r.name));
}

main().catch(console.error).finally(() => prisma.$disconnect());
