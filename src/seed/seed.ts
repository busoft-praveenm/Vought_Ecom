import mysql from 'mysql2/promise';

async function seedProducts() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'agira',
    password: 'Agira@123',
    database: 'vought_ecom'
  });

  const [categories] = await connection.execute('SELECT id, name FROM tbl_category WHERE is_active = 1');
  
  for (const cat of (categories as any[])) {
    console.log(`Seeding 20 products for category: ${cat.name} (ID: ${cat.id})`);
    for (let i = 1; i <= 20; i++) {
      const name = `${cat.name} Premium Model ${i}`;
      const description = `This is a high quality product in the ${cat.name} category. Ideal for all your needs.`;
      const price = Math.floor(Math.random() * 900) + 10;
      const stock = Math.floor(Math.random() * 100) + 1;
      const sku = `SKU-${cat.id}-${Date.now()}-${i}`;
      const productUid = `uid-${cat.id}-${Date.now()}-${i}`;
      const brand = `Brand ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`; // Brand A-E
      const imageUrl = `https://placehold.co/400x300?text=${encodeURIComponent(cat.name.split(' ')[0])}`;
      
      await connection.execute(
        `INSERT INTO tbl_products (name, description, price, stock, sku, product_uid, brand, image_url, category_id, is_deleted, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
        [name, description, price, stock, sku, productUid, brand, imageUrl, cat.id]
      );
    }
  }
  
  console.log('Finished seeding products.');
  await connection.end();
}

seedProducts().catch(console.error);
