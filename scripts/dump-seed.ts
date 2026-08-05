import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function dump() {
  const users = await prisma.userDb.findMany({ include: { profile: true } });
  const warehouses = await prisma.warehouseDb.findMany({ include: { warehouseProducts: true } });
  
  const dumpDir = path.join(__dirname, 'dump');
  if (!fs.existsSync(dumpDir)) {
    fs.mkdirSync(dumpDir);
  }

  fs.writeFileSync(path.join(dumpDir, 'users.json'), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.join(dumpDir, 'warehouses.json'), JSON.stringify(warehouses, null, 2));

  console.log('Dump completed successfully.');
  await prisma.$disconnect();
}

dump().catch(e => {
  console.error(e);
  process.exit(1);
});
