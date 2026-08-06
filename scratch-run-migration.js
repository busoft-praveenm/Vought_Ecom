const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.MY_SQL_DB_HOST || 'localhost',
    user: process.env.MY_SQL_DB_USER || 'agira',
    password: process.env.MY_SQL_DB_PASS || 'Agira@123',
    database: process.env.MY_SQL_DB_NAME || 'vought_ecom',
    port: parseInt(process.env.MY_SQL_DB_PORT || '3306'),
  });

  console.log('Connected to DB');

  try {
    console.log('Creating product_categories...');
    await connection.query(`CREATE TABLE IF NOT EXISTS \`product_categories\` (\`product_id\` int NOT NULL, \`category_id\` int NOT NULL, INDEX \`IDX_product_id\` (\`product_id\`), INDEX \`IDX_category_id\` (\`category_id\`), PRIMARY KEY (\`product_id\`, \`category_id\`)) ENGINE=InnoDB`);
    
    console.log('Adding constraints...');
    // We can use IF NOT EXISTS logic or just catch errors if they already exist
    try {
      await connection.query(`ALTER TABLE \`product_categories\` ADD CONSTRAINT \`FK_product_categories_product_id\` FOREIGN KEY (\`product_id\`) REFERENCES \`tbl_products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
      await connection.query(`ALTER TABLE \`product_categories\` ADD CONSTRAINT \`FK_product_categories_category_id\` FOREIGN KEY (\`category_id\`) REFERENCES \`tbl_category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    } catch (e) {
      console.log('Constraints might already exist:', e.message);
    }

    console.log('Migrating data...');
    try {
      await connection.query(`INSERT IGNORE INTO \`product_categories\` (\`product_id\`, \`category_id\`) SELECT \`id\`, \`category_id\` FROM \`tbl_products\` WHERE \`category_id\` IS NOT NULL`);
    } catch (e) {
      console.log('Data migration error:', e.message);
    }

    console.log('Dropping old column...');
    try {
      await connection.query(`ALTER TABLE \`tbl_products\` DROP FOREIGN KEY \`FK_11226b104a5dac008ca4090b936\``);
    } catch (e) {
      console.log('Old foreign key not dropped:', e.message);
    }
    
    try {
      await connection.query(`ALTER TABLE \`tbl_products\` DROP COLUMN \`category_id\``);
    } catch (e) {
      console.log('Old column not dropped:', e.message);
    }

    console.log('Recording migration in TypeORM...');
    try {
      await connection.query(`INSERT IGNORE INTO migrations (timestamp, name) VALUES (1784712024000, 'ManyToManyCategories1784712024000')`);
    } catch (e) {
      console.log('Migration record error:', e.message);
    }

    console.log('Migration completed.');
  } catch (err) {
    console.error('Migration failed completely:', err);
  } finally {
    await connection.end();
  }
}

runMigration();
