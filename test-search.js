const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const query = "Product 38";
  
  // Test 1: natural
  console.log("Testing Natural:");
  const res1 = await prisma.productsDb.findMany({
    where: { name: { search: query } },
    take: 3
  });
  console.log(res1.map(r => r.name));

  // Test 2: Boolean mode (require all words)
  const booleanQuery = query.split(' ').map(word => `+${word}`).join(' ');
  console.log("\nTesting Boolean (+Word +Word):", booleanQuery);
  try {
    const res2 = await prisma.productsDb.findMany({
      where: { name: { search: booleanQuery } },
      take: 3
    });
    console.log(res2.map(r => r.name));
  } catch(e) { console.log(e.message) }
  
  // Test 3: Phrase query ("Product 38")
  const phraseQuery = `\"${query}\"`;
  console.log("\nTesting Phrase:", phraseQuery);
  try {
    const res3 = await prisma.productsDb.findMany({
      where: { name: { search: phraseQuery } },
      take: 3
    });
    console.log(res3.map(r => r.name));
  } catch(e) { console.log(e.message) }
}

main().catch(console.error).finally(() => prisma.$disconnect());
