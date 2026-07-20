const mysql = require('mysql2/promise');

async function seedCategories() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'agira',
    password: 'Agira@123',
    database: 'vought_ecom'
  });

  const categories = [
    { name: 'Laptops', description: 'Powerful laptops' },
    { name: 'Smartphones', description: 'Latest mobile devices' },
    { name: 'Tablets', description: 'Portable tablets' },
    { name: 'Audio', description: 'Headphones and speakers' },
    { name: 'Cameras', description: 'Photography gear' },
    { name: 'Accessories', description: 'Cables, chargers, etc' },
    { name: 'Monitors', description: 'High-res displays' },
    { name: 'Storage', description: 'HDDs, SSDs, Flash drives' },
    { name: 'Networking', description: 'Routers and switches' },
    { name: 'Printers', description: 'Home and office printers' },
    { name: 'Smart Home', description: 'IoT devices' },
    { name: 'Components', description: 'PC parts' },
    { name: 'Software', description: 'OS and applications' },
    { name: 'Books', description: 'Physical and ebooks' },
    { name: 'Clothing', description: 'Apparel' },
    { name: 'Footwear', description: 'Shoes and sneakers' },
    { name: 'Toys', description: 'Kids toys' },
    { name: 'Furniture', description: 'Home furniture' }
  ];

  for (const cat of categories) {
    try {
      await connection.execute(
        'INSERT INTO tbl_category (name, description, is_active, created_at, updated_at) VALUES (?, ?, 1, NOW(), NOW())',
        [cat.name, cat.description]
      );
      console.log(`Inserted ${cat.name}`);
    } catch (err) {
      console.log(`Skipped ${cat.name} (maybe exists)`);
    }
  }

  await connection.end();
}

seedCategories();
