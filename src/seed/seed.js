const mysql = require('mysql2/promise');

async function seedProducts() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'agira',
    password: 'Agira@123',
    database: 'vought_ecom'
  });

  const catImage = 'https://as1.ftcdn.net/v2/jpg/03/59/09/04/1000_F_359090423_7kA3WC9HnDEf1I9dx4ccGFhhO90vmzhk.jpg';
  const brandImage = 'https://static.vecteezy.com/system/resources/previews/026/398/902/non_2x/brand-and-trademark-concept-increasing-value-of-goods-and-products-marketing-that-shows-unique-identity-of-product-advertising-business-with-mark-or-logo-design-that-expresses-identity-and-quality-free-photo.jpg';
  const productImage = 'https://xelltechnology.com/wp-content/uploads/2022/04/dummy3.jpg';

  console.log('Clearing existing data...');
  await connection.execute('DELETE FROM product_categories');
  await connection.execute('DELETE FROM tbl_products');
  await connection.execute('DELETE FROM tbl_brand');
  await connection.execute('DELETE FROM tbl_category');

  console.log('Seeding brands...');
  const brandIds = [];
  const brandNames = ['Vought International', 'Starlight Tech', 'Seven Home', 'A-Train Sports', 'Deep Aqua'];
  for (const name of brandNames) {
    const [result] = await connection.execute(
      `INSERT INTO tbl_brand (name, description, image_url, is_active, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())`,
      [name, `Premium products from ${name}`, brandImage]
    );
    brandIds.push(result.insertId);
  }

  console.log('Seeding categories...');
  const catIds = [];
  const catNames = ['Electronics', 'Home & Kitchen', 'Sports', 'Toys', 'Fashion'];
  for (const name of catNames) {
    const [result] = await connection.execute(
      `INSERT INTO tbl_category (name, description, image_url, is_active, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())`,
      [name, `Awesome ${name}`, catImage]
    );
    catIds.push(result.insertId);
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

    const [result] = await connection.execute(
      `INSERT INTO tbl_products (name, description, price, stock, sku, product_uid, image_url, brand_id, is_deleted, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
      [name, description, price, stock, sku, productUid, productImage, brandId]
    );
    
    const productId = result.insertId;

    // Assign categories
    const numCats = i <= 10 ? 2 : 1; // First 10 products get 2 categories
    const shuffledCats = [...catIds].sort(() => 0.5 - Math.random());
    const assignedCats = shuffledCats.slice(0, numCats);

    for (const cId of assignedCats) {
      await connection.execute(
        `INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)`,
        [productId, cId]
      );
    }
  }

  console.log('Finished seeding database.');
  await connection.end();
}

seedProducts().catch(console.error);
